<?php

namespace Tests\Feature\Admin;

use App\Models\Sondage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\WithRoles;

class AdminSondageTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Accès ---

    public function test_citoyen_cannot_access_admin_sondages(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('admin.sondages.index'))
            ->assertForbidden();
    }

    public function test_agent_can_access_admin_sondages(): void
    {
        $this->actingAs($this->createAgent())
            ->get(route('admin.sondages.index'))
            ->assertOk();
    }

    // --- Liste ---

    public function test_admin_sees_all_sondages_with_counts(): void
    {
        $admin = $this->createAdmin();
        Sondage::factory()->create(['user_id' => $admin->id, 'status' => 'actif']);
        Sondage::factory()->brouillon()->create(['user_id' => $admin->id]);
        Sondage::factory()->termine()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($admin)->get(route('admin.sondages.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->where('counts.total', 3)
                 ->where('counts.actif', 1)
                 ->where('counts.brouillon', 1)
                 ->where('counts.termine', 1)
        );
    }

    // --- Création ---

    public function test_agent_can_access_create_sondage_form(): void
    {
        $this->actingAs($this->createAgent())
            ->get(route('admin.sondages.create'))
            ->assertOk();
    }

    public function test_admin_can_create_sondage_with_questions(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post(route('admin.sondages.store'), [
            'titre'       => 'Satisfaction espaces verts',
            'description' => 'Votre avis sur les parcs',
            'status'      => 'actif',
            'audience'    => 'tous',
            'questions'   => [
                [
                    'texte'   => 'Êtes-vous satisfait des espaces verts ?',
                    'type'    => 'radio',
                    'options' => [
                        ['texte' => 'Très satisfait'],
                        ['texte' => 'Satisfait'],
                        ['texte' => 'Insatisfait'],
                    ],
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.sondages.index'));
        $this->assertDatabaseHas('sondages', ['titre' => 'Satisfaction espaces verts']);

        $sondage = Sondage::where('titre', 'Satisfaction espaces verts')->first();
        $this->assertCount(1, $sondage->questions);
        $this->assertCount(3, $sondage->questions->first()->options);
    }

    public function test_create_sondage_fails_without_title(): void
    {
        $this->actingAs($this->createAdmin())
            ->post(route('admin.sondages.store'), [
                'description' => 'Test',
                'status'      => 'actif',
                'audience'    => 'tous',
                'questions'   => [['texte' => 'Q1', 'type' => 'radio', 'options' => [['texte' => 'A'], ['texte' => 'B']]]],
            ])
            ->assertSessionHasErrors(['titre']);
    }

    public function test_create_sondage_fails_without_questions(): void
    {
        $this->actingAs($this->createAdmin())
            ->post(route('admin.sondages.store'), [
                'titre'       => 'Test',
                'description' => 'Test',
                'status'      => 'actif',
                'audience'    => 'tous',
                'questions'   => [],
            ])
            ->assertSessionHasErrors(['questions']);
    }

    public function test_admin_can_publish_a_draft_sondage(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->brouillon()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.sondages.update', $sondage), ['status' => 'actif']);

        $this->assertDatabaseHas('sondages', [
            'id'     => $sondage->id,
            'status' => 'actif',
        ]);
    }

    public function test_admin_can_terminate_an_active_sondage(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.sondages.update', $sondage), ['status' => 'termine']);

        $this->assertDatabaseHas('sondages', [
            'id'     => $sondage->id,
            'status' => 'termine',
        ]);
    }

    public function test_admin_can_delete_sondage(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->delete(route('admin.sondages.destroy', $sondage))
            ->assertRedirect(route('admin.sondages.index'));

        $this->assertDatabaseMissing('sondages', ['id' => $sondage->id]);
    }

    public function test_deleting_sondage_cascades_to_questions_and_responses(): void
    {
        $admin = $this->createAdmin();
        $sondage = Sondage::factory()->create(['user_id' => $admin->id]);

        $question = \App\Models\QuestionSondage::create([
            'sondage_id' => $sondage->id,
            'texte'      => 'Question test',
            'type'       => 'texte',
            'ordre'      => 0,
        ]);

        $this->actingAs($admin)->delete(route('admin.sondages.destroy', $sondage));

        $this->assertDatabaseMissing('questions_sondages', ['id' => $question->id]);
    }
}
