@extends('layouts.app')

@section('title', __('boards.'.$type))

@section('content')
    <board type="{{$type}}"></board>
@endsection
