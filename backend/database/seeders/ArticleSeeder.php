<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articlesData = [
            [
                'title' => 'Welcome to the Blog',
                'content' => 'This is your first article in the demo blog. You can edit or delete it, or add more articles to experiment with the API and frontend.',
            ],
            [
                'title' => 'Second Article',
                'content' => 'Here is another article with a bit more content to demonstrate listing, viewing and commenting features in the application.',
            ],
            [
                'title' => 'Laravel & React Demo',
                'content' => 'This article explains that the backend is built with Laravel and the frontend with React. Use it to test comment creation and API responses.',
            ],
        ];

        foreach ($articlesData as $data) {
            $article = Article::create($data);

            Comment::create([
                'article_id' => $article->id,
                'author_name' => 'System',
                'content' => 'This is an example comment for the article: '.$article->title,
            ]);
        }
    }
}

