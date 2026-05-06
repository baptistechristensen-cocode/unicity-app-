<?php

namespace Tests\Feature;

use App\Models\Evenement;
use App\Models\EvenementInteret;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\WithRoles;

class EvenementTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Accès ---

    public function test_guest_is_redirected_from_agenda(): void
    {
        $this->get(route('agenda.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_agenda(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('agenda.index'))
            ->assertOk();
    }

    // --- Liste et filtres ---

    public function test_only_upcoming_events_show_by_default(): void
    {
        $admin = $this->createAdmin();
        Evenement::factory()->count(3)->create(['user_id' => $admin->id]);
        Evenement::factory()->count(2)->passe()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('agenda.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->count('evenements', 3)
        );
    }

    public function test_filter_by_theme_returns_correct_events(): void
    {
        $admin = $this->createAdmin();
        Evenement::factory()->count(2)->theme('sport')->create(['user_id' => $admin->id]);
        Evenement::factory()->count(3)->theme('culture')->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('agenda.index', ['theme' => 'sport']));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->count('evenements', 2)
        );
    }

    public function test_invalid_theme_is_ignored(): void
    {
        $admin = $this->createAdmin();
        Evenement::factory()->count(3)->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('agenda.index', ['theme' => 'theme_inexistant']));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->count('evenements', 3)
        );
    }

    // --- Affichage ---

    public function test_user_can_view_event_detail(): void
    {
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($this->createCitoyen())
            ->get(route('agenda.show', $evenement))
            ->assertOk()
            ->assertInertia(fn ($page) =>
                $page->component('agenda/show')
                     ->where('evenement.id', $evenement->id)
            );
    }

    // --- Intérêt ---

    public function test_user_can_mark_interest_for_event(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($citoyen)
            ->post(route('agenda.interet', $evenement))
            ->assertRedirect();

        $this->assertDatabaseHas('evenement_interets', [
            'evenement_id' => $evenement->id,
            'user_id'      => $citoyen->id,
        ]);
    }

    public function test_user_can_unmark_interest_by_posting_again(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);

        EvenementInteret::create([
            'evenement_id' => $evenement->id,
            'user_id'      => $citoyen->id,
        ]);

        $this->actingAs($citoyen)
            ->post(route('agenda.interet', $evenement));

        $this->assertDatabaseMissing('evenement_interets', [
            'evenement_id' => $evenement->id,
            'user_id'      => $citoyen->id,
        ]);
    }

    public function test_interest_count_is_correct(): void
    {
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);

        $citoyens = \App\Models\User::factory()->count(4)->create();
        foreach ($citoyens as $c) {
            EvenementInteret::create([
                'evenement_id' => $evenement->id,
                'user_id'      => $c->id,
            ]);
        }

        $this->actingAs($this->createCitoyen())
            ->get(route('agenda.show', $evenement))
            ->assertInertia(fn ($page) =>
                $page->where('evenement.interets_count', 4)
            );
    }

    public function test_user_cannot_mark_interest_twice(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($citoyen)->post(route('agenda.interet', $evenement));
        $this->actingAs($citoyen)->post(route('agenda.interet', $evenement));

        $this->assertEquals(0, EvenementInteret::where([
            'evenement_id' => $evenement->id,
            'user_id'      => $citoyen->id,
        ])->count());
    }

    public function test_event_detail_shows_if_user_is_interested(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);

        EvenementInteret::create([
            'evenement_id' => $evenement->id,
            'user_id'      => $citoyen->id,
        ]);

        $this->actingAs($citoyen)
            ->get(route('agenda.show', $evenement))
            ->assertInertia(fn ($page) =>
                $page->where('estInteresse', true)
            );
    }
}
