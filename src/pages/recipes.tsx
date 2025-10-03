import { Crud } from "@toolpad/core/Crud";
import { useNavigate, useParams } from "react-router";
import { Button } from "@mui/material";
import {
  PageContainer,
  PageHeader,
  PageHeaderToolbar,
} from "@toolpad/core/PageContainer";
import {
  recipesDataSource,
  Recipe,
  recipesCache,
} from "../data/recipes";

export default function RecipesCrudPage() {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  // Botón para volver a Production Orders
  const handleBack = () => {
    navigate("/production-orders");
  };

  const CustomToolbar = () => {
    return (
      <PageHeaderToolbar>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          Volver
        </Button>
      </PageHeaderToolbar>
    );
  };

  const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
  };

  const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
  };

  return (
    <Crud<Recipe>
      dataSource={recipesDataSource}
      dataSourceCache={recipesCache}
      rootPath="/recipes"
      initialPageSize={10}
      defaultValues={{
        name: "",
        description: "",
        ingredients: [],
      }}
      pageTitles={{
        show: `Recipe ${recipeId}`,
        create: "New Recipe",
        edit: `Recipe ${recipeId} - Edit`,
      }}
      slots={{
        pageContainer: CustomPageContainer, 
      }}
    />
  );
}
