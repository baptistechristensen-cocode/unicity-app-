<?php

namespace Tests\Feature\Admin;

use App\Models\Evenement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\WithRoles;

class AdminEvenementTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Accès ---

    public function test_citoyen_cannot_access_admin_agenda(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('admin.agenda.index'))
            ->assertForbidden();
    }

    public function test_agent_can_access_admin_agenda(): void
    {
        $this->actingAs($this->createAgent())
            ->get(route('admin.agenda.index'))
            ->assertOk();
    }

    // --- Liste ---

    public function test_admin_sees_all_events_with_counts(): void
    {
        $admin = $this->createAdmin();
        Evenement::factory()->count(3)->create(['user_id' => $admin->id]);
        Evenement::factory()->count(2)->passe()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($admin)->get(route('admin.agenda.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->where('counts.total', 5)
                 ->where('counts.a_venir', 3)
                 ->where('counts.passes', 2)
        );
    }

    // --- Création ---

    public function test_agent_can_access_create_event_form(): void
    {
        $this->actingAs($this->createAgent())
            ->get(route('admin.agenda.create'))
            ->assertOk();
    }

    public function test_admin_can_create_event(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post(route('admin.agenda.store'), [
            'titre'        => 'Fête de la Musique 2026',
            'description'  => 'Concert gratuit en plein air',
            'date_debut'   => now()->addMonth()->format('Y-m-d\TH:i'),
            'lieu'         => 'Place de la Mairie',
            'theme'        => 'culture',
            'organisateur' => 'Mairie de Novaville',
        ]);

        $response->assertRedirect(route('admin.agenda.index'));
        $this->assertDatabaseHas('evenements', [
            'titre' => 'Fête de la Musique 2026',
            'theme' => 'culture',
        ]);
    }

    public function test_create_event_fails_without_required_fields(): void
    {
        $this->actingAs($this->createAdmin())
            ->post(route('admin.agenda.store'), [])
            ->assertSessionHasErrors(['titre', 'description', 'date_debut', 'lieu', 'theme', 'organisateur']);
    }

    public function test_create_event_fails_with_invalid_theme(): void
    {
        $this->actingAs($this->createAdmin())
            ->post(route('admin.agenda.store'), [
                'titre'        => 'Test',
                'description'  => 'Test',
                'date_debut'   => now()->addDay()->format('Y-m-d\TH:i'),
                'lieu'         => 'Test',
                'theme'        => 'theme_invalide',
                'organisateur' => 'Test',
            ])
            ->assertSessionHasErrors(['theme']);
    }

    public function test_admin_can_upload_banner_image(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();

        $this->actingAs($admin)->post(route('admin.agenda.store'), [
            'titre'        => 'Avec bannière',
            'description'  => 'Test',
            'date_debut'   => now()->addDay()->format('Y-m-d\TH:i'),
            'lieu'         => 'Test',
            'theme'        => 'sport',
            'organisateur' => 'Test',
            'banniere'     => UploadedFile::fake()->image('banner.jpg', 1200, 400),
        ]);

        $evenement = Evenement::where('titre', 'Avec bannière')->first();
        $this->assertNotNull($evenement->banniere);
        Storage::disk('public')->assertExists($evenement->banniere);
    }

    // --- Suppression ---

    public function test_admin_can_delete_event(): void
    {
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->delete(route('admin.agenda.destroy', $evenement))
            ->assertRedirect(route('admin.agenda.index'));

        $this->assertDatabaseMissing('evenements', ['id' => $evenement->id]);
    }

    public function test_deleting_event_removes_associated_interests(): void
    {
        $admin = $this->createAdmin();
        $evenement = Evenement::factory()->create(['user_id' => $admin->id]);
        $citoyen = $this->createCitoyen();

        \App\Models\EvenementInteret::create([
            'evenement_id' => $evenement->id,
            'user_id'      => $citoyen->id,
        ]);

        $this->actingAs($admin)->delete(route('admin.agenda.destroy', $evenement));

        $this->assertDatabaseMissing('evenement_interets', [
            'evenement_id' => $evenement->id,
        ]);
    }
}
