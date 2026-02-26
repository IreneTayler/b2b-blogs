<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and are assigned the "api"
| middleware group. Make something great!
|
*/

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);
Route::post('/articles', [ArticleController::class, 'store']);
Route::post('/articles/{article}/comments', [CommentController::class, 'store']);

