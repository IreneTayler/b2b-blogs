<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ArticleController extends Controller
{
    /**
     * Display a listing of the articles.
     */
    public function index()
    {
        $articles = Article::query()
            ->latest()
            ->get();

        return response()->json($articles);
    }

    /**
     * Store a newly created article in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $user = $request->attributes->get('api_user');
        $article = Article::create([...$validated, 'user_id' => $user->id]);

        return response()->json($article, Response::HTTP_CREATED);
    }

    /**
     * Display the specified article with its comments.
     */
    public function show(Article $article)
    {
        $article->load('comments');

        return response()->json($article);
    }
}

