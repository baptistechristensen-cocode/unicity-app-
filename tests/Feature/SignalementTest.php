<?php

namespace Tests\Feature;

use App\Models\Signalement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\WithRoles;

class SignalementTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Accès ---

    public function test_guest_is_redirected_from_signalements_list(): void
    {
        $this->get(route('signalements.index'))->assertRedirect(route('login'));
    }

    public function test_guest_is_redirected_from_create_form(): void
    {
        $this->get(route('signalements.create'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_signalements_list(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('signalements.index'))
            ->assertOk();
    }

    // --- Liste et filtres ---

    public function test_signalements_list_shows_all_non_resolved_by_default(): void
    {
        $citoyen = $this->createCitoyen();
        Signalement::factory()->create(['user_id' => $citoyen->id, 'status' => 'enregistre']);
        Signalement::factory()->create(['user_id' => $citoyen->id, 'status' => 'en_cours']);
        Signalement::factory()->resolu()->create(['user_id' => $citoyen->id]);

        $response = $this->actingAs($citoyen)->get(route('signalements.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->where('counts.enregistre', 1)
                 ->where('counts.en_cours', 1)
                 ->where('counts.resolu', 1)
        );
    }

    public function test_filter_by_status_returns_correct_signalements(): void
    {
        $citoyen = $this->createCitoyen();
        Signalement::factory()->create(['user_id' => $citoyen->id, 'status' => 'enregistre']);
        Signalement::factory()->enCours()->create(['user_id' => $citoyen->id]);

        $response = $this->actingAs($citoyen)
            ->get(route('signalements.index', ['status' => 'en_cours']));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->where('signalements.total', 1)
        );
    }

    // --- Création ---

    public function test_authenticated_user_can_access_create_form(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('signalements.create'))
            ->assertOk();
    }

    public function test_user_can_create_a_signalement(): void
    {
        $citoyen = $this->createCitoyen();

        $response = $this->actingAs($citoyen)->post(route('signalements.store'), [
            'titre'       => 'Nid de poule rue de la Paix',
            'description' => 'Grand nid de poule dangereux.',
            'category'    => 'voirie',
            'location'    => '10 rue de la Paix',
        ]);

        $response->assertRedirect(route('signalements.index'));
        $this->assertDatabaseHas('signalements', [
            'titre'   => 'Nid de poule rue de la Paix',
            'user_id' => $citoyen->id,
            'status'  => 'enregistre',
        ]);
    }

    public function test_creating_signalement_automatically_creates_timeline_entry(): void
    {
        $citoyen = $this->createCitoyen();

        $this->actingAs($citoyen)->post(route('signalements.store'), [
            'titre'       => 'Test timeline',
            'description' => 'Description test',
            'category'    => 'autre',
        ]);

        $signalement = Signalement::where('titre', 'Test timeline')->first();

        $this->assertDatabaseHas('signalement_timelines', [
            'signalement_id' => $signalement->id,
            'status'         => 'enregistre',
        ]);
    }

    public function test_user_can_upload_photo_with_signalement(): void
    {
        Storage::fake('public');
        $citoyen = $this->createCitoyen();

        $this->actingAs($citoyen)->post(route('signalements.store'), [
            'titre'       => 'Avec photo',
            'description' => 'Description',
            'category'    => 'proprete',
            'photo'       => UploadedFile::fake()->image('photo.jpg', 800, 600),
        ]);

        $signalement = Signalement::where('titre', 'Avec photo')->first();
        $this->assertNotNull($signalement->photo);
        Storage::disk('public')->assertExists($signalement->photo);
    }

    public function test_create_signalement_fails_without_required_fields(): void
    {
        $this->actingAs($this->createCitoyen())
            ->post(route('signalements.store'), [])
            ->assertSessionHasErrors(['titre', 'description', 'category']);
    }

    public function test_create_signalement_fails_with_invalid_category(): void
    {
        $this->actingAs($this->createCitoyen())
            ->post(route('signalements.store'), [
                'titre'       => 'Test',
                'description' => 'Test',
                'category'    => 'categorie_invalide',
            ])
            ->assertSessionHasErrors(['category']);
    }

    public function test_photo_file_size_limit_is_enforced(): void
    {
        Storage::fake('public');
        $citoyen = $this->createCitoyen();

        $this->actingAs($citoyen)
            ->post(route('signalements.store'), [
                'titre'       => 'Trop lourd',
                'description' => 'Test',
                'category'    => 'autre',
                'photo'       => UploadedFile::fake()->image('big.jpg')->size(6000),
            ])
            ->assertSessionHasErrors(['photo']);
    }

    // --- Affichage ---

    public function test_user_can_view_their_own_signalement(): void
    {
        $citoyen = $this->createCitoyen();
        $signalement = Signalement::factory()->create(['user_id' => $citoyen->id]);

        $this->actingAs($citoyen)
            ->get(route('signalements.show', $signalement))
            ->assertOk();
    }

    public function test_user_cannot_view_another_users_signalement(): void
    {
        $citoyen1 = $this->createCitoyen();
        $citoyen2 = $this->createCitoyen();
        $signalement = Signalement::factory()->create(['user_id' => $citoyen1->id]);

        $this->actingAs($citoyen2)
            ->get(route('signalements.show', $signalement))
            ->assertForbidden();
    }

    // --- Statut et timeline ---

    public function test_signalement_detail_shows_timeline(): void
    {
        $citoyen = $this->createCitoyen();
        $signalement = Signalement::factory()->create(['user_id' => $citoyen->id]);

        $response = $this->actingAs($citoyen)
            ->get(route('signalements.show', $signalement));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->has('signalement.timelines')
        );
    }
}
