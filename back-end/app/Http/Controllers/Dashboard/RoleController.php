<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Role;

class RoleController extends Controller
{

    public function index()
    {
        $roles = Role::all();
        return response()->json(['success' => true, 'data' => $roles],201);

    }


}
