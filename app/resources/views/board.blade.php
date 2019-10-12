@extends('layouts.app')

@section('title', __('boards.'.$type))

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h1>{{ __('boards.'.$type) }}</h1>
            </div>
        </div>
    </div>
@endsection
