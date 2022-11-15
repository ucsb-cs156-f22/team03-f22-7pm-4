import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemForm from "main/components/MenuItem/MenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemCreatePage() {

  const objectToAxiosParams = (menuItem) => ({
    url: "/api/UCSBDiningCommonsMenuItem/post",
    method: "POST",
    params: {
      name: menuItem.name,
      diningCommonsCode: menuItem.diningCommonsCode,
      station: menuItem.station,
    }
  });

  const onSuccess = (menuItem) => {
    toast(`New Menu Item Created - id: ${menuItem.id} name: ${menuItem.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBDiningCommonsMenuItem/all"]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/menuItem/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSB Dining Commons Menu Item </h1>

        <MenuItemForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}