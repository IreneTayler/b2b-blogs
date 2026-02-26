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
     * Members may not comment on their own articles.
     */
    public function store(Request $request, Article $article)
    {
        $user = $request->attributes->get('api_user');
        if ($article->user_id && (int) $article->user_id === (int) $user->id) {
            return response()->json(
                ['message' => 'You cannot comment on your own article.'],
                Response::HTTP_FORBIDDEN
            );
        }

        $validated = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $comment = Comment::create([
            'article_id' => $article->id,
            'author_name' => $user->name,
            'content' => $validated['content'],
        ]);

        return response()->json($comment, Response::HTTP_CREATED);
    }
}

