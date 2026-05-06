<?php

namespace Tests\Feature;

use App\Models\OptionQuestion;
use App\Models\QuestionSondage;
use App\Models\ReponseSondage;
use App\Models\Sondage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\WithRoles;

class SondageTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Accès ---

    public function test_guest_is_redirected_from_sondages_list(): void
    {
        $this->get(route('sondages.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_sondages_list(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('sondages.index'))
            ->assertOk();
    }

    // --- Liste ---

    public function test_only_active_sondages_show_by_default(): void
    {
        $admin = $this->createAdmin();
        Sondage::factory()->create(['user_id' => $admin->id, 'status' => 'actif']);
        Sondage::factory()->brouillon()->create(['user_id' => $admin->id]);
        Sondage::factory()->termine()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('sondages.index'));

        $response->assertInertia(fn ($page) =>
            $page->count('sondages', 1)
                 ->where('counts.actif', 1)
                 ->where('counts.termine', 1)
        );
    }

    public function test_filter_termine_shows_only_terminated_sondages(): void
    {
        $admin = $this->createAdmin();
        Sondage::factory()->create(['user_id' => $admin->id]);
        Sondage::factory()->termine()->create(['user_id' => $admin->id]);
        Sondage::factory()->termine()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('sondages.index', ['filter' => 'termine']));

        $response->assertInertia(fn ($page) =>
            $page->count('sondages', 2)
        );
    }

    public function test_mes_reponses_filter_shows_only_answered_sondages(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();

        $sondageAnswered = Sondage::factory()->create(['user_id' => $admin->id]);
        $sondageUnanswered = Sondage::factory()->create(['user_id' => $admin->id]);

        ReponseSondage::create([
            'sondage_id' => $sondageAnswered->id,
            'user_id'    => $citoyen->id,
        ]);

        $response = $this->actingAs($citoyen)
            ->get(route('sondages.index', ['filter' => 'mes_reponses']));

        $response->assertInertia(fn ($page) =>
            $page->count('sondages', 1)
                 ->where('sondages.0.id', $sondageAnswered->id)
        );
    }

    // --- Affichage ---

    public function test_brouillon_sondage_returns_404(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->brouillon()->create(['user_id' => $admin->id]);

        $this->actingAs($this->createCitoyen())
            ->get(route('sondages.show', $sondage))
            ->assertNotFound();
    }

    public function test_active_sondage_shows_form_to_unanswered_user(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('sondages.show', $sondage));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('sondages/show')
                 ->where('aRepondu', false)
        );
    }

    public function test_already_answered_sondage_redirects_to_results(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        ReponseSondage::create([
            'sondage_id' => $sondage->id,
            'user_id'    => $citoyen->id,
        ]);

        $response = $this->actingAs($citoyen)
            ->get(route('sondages.show', $sondage));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('sondages/resultats')
                 ->where('aRepondu', true)
        );
    }

    public function test_terminated_sondage_shows_results_directly(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->termine()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('sondages.show', $sondage));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('sondages/resultats')
        );
    }

    // --- Soumission ---

    public function test_user_can_submit_radio_response(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        $question = QuestionSondage::create([
            'sondage_id' => $sondage->id,
            'texte'      => 'Êtes-vous satisfait ?',
            'type'       => 'radio',
            'ordre'      => 0,
        ]);
        $option = OptionQuestion::create([
            'question_id' => $question->id,
            'texte'       => 'Oui',
            'ordre'       => 0,
        ]);

        $response = $this->actingAs($citoyen)
            ->post(route('sondages.store', $sondage), [
                'reponses' => [$question->id => $option->id],
            ]);

        $response->assertRedirect(route('sondages.resultats', $sondage));
        $this->assertDatabaseHas('reponses_sondages', [
            'sondage_id' => $sondage->id,
            'user_id'    => $citoyen->id,
        ]);
        $this->assertDatabaseHas('reponses_questions', [
            'question_id' => $question->id,
            'option_id'   => $option->id,
        ]);
    }

    public function test_user_can_submit_free_text_response(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        $question = QuestionSondage::create([
            'sondage_id' => $sondage->id,
            'texte'      => 'Vos suggestions ?',
            'type'       => 'texte',
            'ordre'      => 0,
        ]);

        $this->actingAs($citoyen)
            ->post(route('sondages.store', $sondage), [
                'reponses' => [$question->id => 'Plus de pistes cyclables'],
            ]);

        $this->assertDatabaseHas('reponses_questions', [
            'question_id' => $question->id,
            'texte'       => 'Plus de pistes cyclables',
        ]);
    }

    public function test_user_cannot_respond_twice_to_same_sondage(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        ReponseSondage::create([
            'sondage_id' => $sondage->id,
            'user_id'    => $citoyen->id,
        ]);

        $this->actingAs($citoyen)
            ->post(route('sondages.store', $sondage), ['reponses' => []])
            ->assertSessionHasErrors('sondage');
    }

    public function test_terminated_sondage_cannot_receive_responses(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->termine()->create(['user_id' => $admin->id]);

        $this->actingAs($citoyen)
            ->post(route('sondages.store', $sondage), ['reponses' => []])
            ->assertSessionHasErrors('sondage');
    }

    // --- Résultats ---

    public function test_user_can_view_results_of_sondage_they_answered(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        ReponseSondage::create([
            'sondage_id' => $sondage->id,
            'user_id'    => $citoyen->id,
        ]);

        $this->actingAs($citoyen)
            ->get(route('sondages.resultats', $sondage))
            ->assertOk()
            ->assertInertia(fn ($page) =>
                $page->component('sondages/resultats')
                     ->where('aRepondu', true)
            );
    }

    public function test_results_show_correct_total_count(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        ReponseSondage::factory()->count(5)->create(['sondage_id' => $sondage->id]);

        $this->actingAs($this->createCitoyen())
            ->get(route('sondages.resultats', $sondage))
            ->assertInertia(fn ($page) =>
                $page->where('totalReponses', 5)
            );
    }
}
