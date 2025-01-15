interface CategoryListProps {
  initialData: PaginatedResponse;
}

const CategoryList = ({ initialData }: CategoryListProps) => {
  const router = useRouter();

  const handleDelete = async (id: number) => {
      const result = await deleteCategory(id);
      if (result.success) {
      } else {
      }
    }
  };

  return (
      <div className="max-w-full overflow-x-auto">
          </div>
            </div>
                  <button
                  >
                  </button>
              ))}
            </div>
  );
};

export default CategoryList;