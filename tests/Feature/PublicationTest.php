<?php

namespace Tests\Feature;

use App\Models\Publication;
use App\Models\PublicationLike;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\WithRoles;

class PublicationTest extends TestCase
{
    use RefreshDatabase, WithRoles;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpRoles();
    }

    // --- Accès ---

    public function test_guest_is_redirected_from_discussion(): void
    {
        $this->get(route('discussion.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_discussion(): void
    {
        $this->actingAs($this->createCitoyen())
            ->get(route('discussion.index'))
            ->assertOk();
    }

    // --- Liste ---

    public function test_discussion_shows_all_publications(): void
    {
        $admin = $this->createAdmin();
        Publication::factory()->count(5)->create(['user_id' => $admin->id]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('discussion.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->count('publications', 5)
        );
    }

    public function test_publications_are_ordered_newest_first(): void
    {
        $admin = $this->createAdmin();
        $old = Publication::factory()->create(['user_id' => $admin->id, 'created_at' => now()->subDay()]);
        $new = Publication::factory()->create(['user_id' => $admin->id, 'created_at' => now()]);

        $response = $this->actingAs($this->createCitoyen())
            ->get(route('discussion.index'));

        $response->assertInertia(fn ($page) =>
            $page->where('publications.0.id', $new->id)
                 ->where('publications.1.id', $old->id)
        );
    }

    public function test_user_sees_their_own_like_status(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $publication = Publication::factory()->create(['user_id' => $admin->id]);

        PublicationLike::create([
            'publication_id' => $publication->id,
            'user_id'        => $citoyen->id,
        ]);

        $response = $this->actingAs($citoyen)->get(route('discussion.index'));

        $response->assertInertia(fn ($page) =>
            $page->where('publications.0.a_like', true)
        );
    }

    // --- Likes ---

    public function test_user_can_like_a_publication(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $publication = Publication::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($citoyen)
            ->post(route('publications.like', $publication))
            ->assertRedirect();

        $this->assertDatabaseHas('publication_likes', [
            'publication_id' => $publication->id,
            'user_id'        => $citoyen->id,
        ]);
    }

    public function test_user_can_unlike_by_liking_again(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $publication = Publication::factory()->create(['user_id' => $admin->id]);

        PublicationLike::create([
            'publication_id' => $publication->id,
            'user_id'        => $citoyen->id,
        ]);

        $this->actingAs($citoyen)
            ->post(route('publications.like', $publication));

        $this->assertDatabaseMissing('publication_likes', [
            'publication_id' => $publication->id,
            'user_id'        => $citoyen->id,
        ]);
    }

    public function test_likes_count_is_correct(): void
    {
        $admin = $this->createAdmin();
        $publication = Publication::factory()->create(['user_id' => $admin->id]);

        $citoyens = \App\Models\User::factory()->count(3)->create();
        foreach ($citoyens as $c) {
            PublicationLike::create([
                'publication_id' => $publication->id,
                'user_id'        => $c->id,
            ]);
        }

        $this->actingAs($this->createCitoyen())
            ->get(route('discussion.index'))
            ->assertInertia(fn ($page) =>
                $page->where('publications.0.likes_count', 3)
            );
    }

    public function test_user_cannot_like_same_publication_twice(): void
    {
        $citoyen = $this->createCitoyen();
        $admin = $this->createAdmin();
        $publication = Publication::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($citoyen)->post(route('publications.like', $publication));
        $this->actingAs($citoyen)->post(route('publications.like', $publication));

        $this->assertEquals(0, PublicationLike::where([
            'publication_id' => $publication->id,
            'user_id'        => $citoyen->id,
        ])->count());
    }
}
