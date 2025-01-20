<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'user' => new UserResource($this->whenLoaded('user')),
            'total_price' => $this->total_price,
            'formatted_total_price' => $this->formatted_total_price,
            'notes' => $this->notes,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
