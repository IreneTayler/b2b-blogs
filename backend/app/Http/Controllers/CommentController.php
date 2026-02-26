<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CommentController extends Controller
{
    /**
     * Store a newly created comment for the given article.
     */
    public function store(Request $request, Article $article)
    {
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $comment = Comment::create([
            'article_id' => $article->id,
            'author_name' => $validated['author_name'],
            'content' => $validated['content'],
        ]);

        return response()->json($comment, Response::HTTP_CREATED);
    }
}

