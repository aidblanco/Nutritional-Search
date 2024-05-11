import axios from 'axios';

const API_KEY = '3dcc8056dd854a16b54158de9f01fc86';

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams);
  return Response.json(
    (
      await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          ...params,
          addRecipeInformation: true,
          addRecipeNutrition: true,
          fillIngredients: true,
          number: 15,
          apiKey: API_KEY,
        },
      })
    ).data,
  );
}
