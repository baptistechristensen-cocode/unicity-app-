<?php

namespace Tests\Feature\Admin;

use App\Models\Signalement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\WithRoles;

class AdminSignalementTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Contrôle d'accès ---

    public function test_guest_cannot_access_admin(): void
    {
        $this->get(route('admin.signalements.index'))->assertRedirect(route('login'));
    }

    public function test_citoyen_cannot_access_admin_signalements(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('admin.signalements.index'))
            ->assertForbidden();
    }

    public function test_agent_can_access_admin_signalements(): void
    {
        $this->actingAs($this->createAgent())
            ->get(route('admin.signalements.index'))
            ->assertOk();
    }

    public function test_elu_can_access_admin_signalements(): void
    {
        $this->actingAs($this->createElu())
            ->get(route('admin.signalements.index'))
            ->assertOk();
    }

    public function test_admin_can_access_admin_signalements(): void
    {
        $this->actingAs($this->createAdmin())
            ->get(route('admin.signalements.index'))
            ->assertOk();
    }

    // --- Liste et recherche ---

    public function test_admin_sees_all_signalements(): void
    {
        $admin = $this->createAdmin();
        Signalement::factory()->count(5)->create();

        $response = $this->actingAs($admin)->get(route('admin.signalements.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->where('counts.total', 5)
        );
    }

    public function test_admin_can_search_signalements_by_title(): void
    {
        $admin = $this->createAdmin();
        Signalement::factory()->create(['titre' => 'Nid de poule avenue Victor Hugo']);
        Signalement::factory()->create(['titre' => 'Lampadaire cassé']);

        $response = $this->actingAs($admin)
            ->get(route('admin.signalements.index', ['search' => 'Nid']));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->where('signalements.0.titre', 'Nid de poule avenue Victor Hugo')
        );
    }

    public function test_admin_can_filter_signalements_by_status(): void
    {
        $admin = $this->createAdmin();
        Signalement::factory()->create(['status' => 'enregistre']);
        Signalement::factory()->enCours()->create();
        Signalement::factory()->resolu()->create();

        $response = $this->actingAs($admin)
            ->get(route('admin.signalements.index', ['status' => 'en_cours']));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->count('signalements', 1)
        );
    }

    // --- Mise à jour du statut ---

    public function test_agent_can_update_signalement_status(): void
    {
        $agent = $this->createAgent();
        $signalement = Signalement::factory()->create(['status' => 'enregistre']);

        $this->actingAs($agent)
            ->patch(route('admin.signalements.update', $signalement), [
                'status' => 'en_cours',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('signalements', [
            'id'     => $signalement->id,
            'status' => 'en_cours',
        ]);
    }

    public function test_status_change_creates_timeline_entry(): void
    {
        $agent = $this->createAgent();
        $signalement = Signalement::factory()->create(['status' => 'enregistre']);

        $this->actingAs($agent)
            ->patch(route('admin.signalements.update', $signalement), [
                'status' => 'resolu',
            ]);

        $this->assertDatabaseHas('signalement_timelines', [
            'signalement_id' => $signalement->id,
            'status'         => 'resolu',
        ]);
    }

    public function test_same_status_does_not_create_duplicate_timeline_entry(): void
    {
        $agent = $this->createAgent();
        $signalement = Signalement::factory()->create(['status' => 'en_cours']);
        $initialCount = $signalement->timelines()->count();

        $this->actingAs($agent)
            ->patch(route('admin.signalements.update', $signalement), [
                'status' => 'en_cours',
            ]);

        $this->assertEquals($initialCount, $signalement->fresh()->timelines()->count());
    }

    public function test_agent_can_add_commentaire_to_signalement(): void
    {
        $agent = $this->createAgent();
        $signalement = Signalement::factory()->create();

        $this->actingAs($agent)
            ->patch(route('admin.signalements.update', $signalement), [
                'status'      => $signalement->status,
                'commentaire' => 'Les services sont intervenus ce matin.',
            ]);

        $this->assertDatabaseHas('signalements', [
            'id'          => $signalement->id,
            'commentaire' => 'Les services sont intervenus ce matin.',
        ]);
    }

    public function test_agent_can_reject_signalement(): void
    {
        $agent = $this->createAgent();
        $signalement = Signalement::factory()->create(['status' => 'enregistre']);

        $this->actingAs($agent)
            ->patch(route('admin.signalements.update', $signalement), [
                'status' => 'rejete',
            ]);

        $this->assertDatabaseHas('signalements', [
            'id'     => $signalement->id,
            'status' => 'rejete',
        ]);
    }

    public function test_counts_reflect_all_statuses(): void
    {
        $admin = $this->createAdmin();
        Signalement::factory()->count(2)->create(['status' => 'enregistre']);
        Signalement::factory()->count(3)->enCours()->create();
        Signalement::factory()->count(1)->resolu()->create();
        Signalement::factory()->count(1)->rejete()->create();

        $response = $this->actingAs($admin)->get(route('admin.signalements.index'));

        $response->assertInertia(fn ($page) =>
            $page->where('counts.total', 7)
                 ->where('counts.enregistre', 2)
                 ->where('counts.en_cours', 3)
                 ->where('counts.resolu', 1)
                 ->where('counts.rejete', 1)
        );
    }
}
