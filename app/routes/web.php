<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
})->name('home');

Route::get('departures/{stn}/{page?}', 'BoardController@departuresBoard')->name('departures');
Route::get('arrivals/{stn}/{page?}', 'BoardController@arrivalsBoard')->name('arrivals');

// Localization
Route::get('/js/lang.js', 'LocalizationController@jsi18n')->name('assets.lang');
