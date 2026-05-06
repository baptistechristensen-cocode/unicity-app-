<?php

namespace Tests\Feature\Admin;

use App\Models\Publication;
use App\Models\PublicationLike;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tests\WithRoles;

class AdminPublicationTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Accès ---

    public function test_citoyen_cannot_access_admin_publications(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('admin.publications.index'))
            ->assertForbidden();
    }

    public function test_agent_can_access_admin_publications(): void
    {
        $this->actingAs($this->createAgent())
            ->get(route('admin.publications.index'))
            ->assertOk();
    }

    // --- Liste ---

    public function test_admin_sees_all_publications_with_likes_count(): void
    {
        $admin = $this->createAdmin();
        $publications = Publication::factory()->count(3)->create(['user_id' => $admin->id]);

        PublicationLike::create([
            'publication_id' => $publications[0]->id,
            'user_id'        => $this->createCitoyen()->id,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.publications.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->count('publications', 3)
        );
    }

    // --- Création ---

    public function test_admin_can_create_publication(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post(route('admin.publications.store'), [
            'titre'   => 'Travaux rue du Commerce',
            'contenu' => 'Des travaux débutent lundi matin.',
            'source'  => 'mairie',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('publications', [
            'titre'  => 'Travaux rue du Commerce',
            'source' => 'mairie',
        ]);
    }

    public function test_agent_can_create_publication(): void
    {
        $agent = $this->createAgent();

        $this->actingAs($agent)->post(route('admin.publications.store'), [
            'titre'   => 'Publication agent',
            'contenu' => 'Contenu test',
            'source'  => 'facebook',
        ]);

        $this->assertDatabaseHas('publications', [
            'titre'   => 'Publication agent',
            'user_id' => $agent->id,
        ]);
    }

    public function test_create_publication_fails_without_required_fields(): void
    {
        $this->actingAs($this->createAdmin())
            ->post(route('admin.publications.store'), [])
            ->assertSessionHasErrors(['titre', 'contenu', 'source']);
    }

    public function test_create_publication_fails_with_invalid_source(): void
    {
        $this->actingAs($this->createAdmin())
            ->post(route('admin.publications.store'), [
                'titre'   => 'Test',
                'contenu' => 'Test',
                'source'  => 'tiktok',
            ])
            ->assertSessionHasErrors(['source']);
    }

    public function test_admin_can_upload_image_with_publication(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();

        $this->actingAs($admin)->post(route('admin.publications.store'), [
            'titre'   => 'Avec image',
            'contenu' => 'Test contenu',
            'source'  => 'instagram',
            'image'   => UploadedFile::fake()->image('photo.jpg'),
        ]);

        $publication = Publication::where('titre', 'Avec image')->first();
        $this->assertNotNull($publication->image);
        Storage::disk('public')->assertExists($publication->image);
    }

    // --- Suppression ---

    public function test_admin_can_delete_publication(): void
    {
        $admin = $this->createAdmin();
        $publication = Publication::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->delete(route('admin.publications.destroy', $publication))
            ->assertRedirect();

        $this->assertDatabaseMissing('publications', ['id' => $publication->id]);
    }

    public function test_deleting_publication_cascades_to_likes(): void
    {
        $admin = $this->createAdmin();
        $publication = Publication::factory()->create(['user_id' => $admin->id]);
        $citoyen = $this->createCitoyen();

        PublicationLike::create([
            'publication_id' => $publication->id,
            'user_id'        => $citoyen->id,
        ]);

        $this->actingAs($admin)->delete(route('admin.publications.destroy', $publication));

        $this->assertDatabaseMissing('publication_likes', [
            'publication_id' => $publication->id,
        ]);
    }

    public function test_deleting_publication_with_image_removes_file(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();

        $file = UploadedFile::fake()->image('photo.jpg');
        $path = $file->store('publications', 'public');

        $publication = Publication::factory()->create([
            'user_id' => $admin->id,
            'image'   => $path,
        ]);

        $this->actingAs($admin)->delete(route('admin.publications.destroy', $publication));

        Storage::disk('public')->assertMissing($path);
    }
}
