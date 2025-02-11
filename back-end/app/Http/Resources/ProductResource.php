<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'discount' => $this->discount,
            'final_price' => $this->final_price,
            'formatted_final_price' => $this->formatted_final_price,
            'quantity' => $this->quantity,
            'sku' => $this->sku,
            'status' => $this->status,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'image_urls' => $this->image_urls,
            'display_photo_url' => $this->display_photo_url,
            'display_photo_index' => $this->display_photo_index,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
