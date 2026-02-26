<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\ArticleSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed demo data for the blog.
        $this->call([
            ArticleSeeder::class,
        ]);
    }
}
