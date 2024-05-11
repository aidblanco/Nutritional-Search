'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import axios from 'axios';
import { LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { RiseLoader } from 'react-spinners';

const importantNutrients = [
  'calories',
  'fat',
  'saturated fat',
  'carbohydrates',
  'sugar',
  'sodium',
  'protein',
];

export default function Home() {
  const [filters, setFilters] = useState({
    Query: '',
    Type: new Set([]),
    Diet: new Set([]),
    Cuisine: new Set([]),
    Intolerances: new Set([]),
    minCalories: 50,
    maxCalories: 800,
  });

  const handleTextboxChange = (filterName, newText) => {
    setFilters({ ...filters, [filterName]: newText });
  };

  const handleCheckboxChange = (filterName, itemName, state) => {
    state
      ? filters[filterName].add(itemName)
      : filters[filterName].delete(itemName);
    setFilters({ ...filters });
  };

  const handleSlideChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value[0] });
  };

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);

    const res = await axios.get('/api/search', {
      params: Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key.toLowerCase(),
          value instanceof Set
            ? Array.from(value).join(',').toLowerCase()
            : value instanceof String
              ? value.toLowerCase()
              : value,
        ]),
      ),
    });

    setRecipes(res.data.results);
    setLoading(false);
  };

  function Filter({ filterName, items }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>
            {filters[filterName].size > 0
              ? `${filterName} (${Array.from(filters[filterName]).join(', ')})`
              : filterName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{filterName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((itemName, idx) => (
            <DropdownMenuCheckboxItem
              key={`${filterName}-${idx}`}
              checked={filters[filterName].has(itemName)}
              onCheckedChange={(state) =>
                handleCheckboxChange(filterName, itemName, state)
              }
            >
              {itemName}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function Slide({ label, className, filterName, ...props }) {
    return (
      <div className={className}>
        <Label className='mt-1'>
          {label} - {[filters[filterName]]}
        </Label>
        <Slider
          step={25}
          className='mt-1 mb-1'
          value={[filters[filterName]]}
          onValueChange={(e) => handleSlideChange(filterName, e)}
          {...props}
        />
      </div>
    );
  }

  return (
    <main className='flex flex-col items-center my-24 px-4 ma mx-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16'>
        <div className='grid grid-rows-1 min-w-2/6'>
          <h1 className='text-2xl font-bold'>Search for Dishes</h1>
          <div className='grid grid-cols-1 gap-y-2 gap-x-2 py-4 w-full'>
            <Input
              type='text'
              onChange={(e) => handleTextboxChange('Query', e.target.value)}
              placeholder="Search query (Try 'pasta')"
              className='mb-4'
            />

            <Filter
              filterName='Diet'
              items={[
                'Vegetarian',
                'Whole30',
                'Ketogenic',
                'Gluten Free',
                'Vegan',
                'Pescetarian',
                'Primal',
              ]}
            />
            <Filter
              filterName='Cuisine'
              items={[
                'Asian',
                'American',
                'Caribbean',
                'Chinese',
                'Indian',
                'European',
                'Korean',
                'Mexican',
                'Thai',
              ]}
            />
            <Filter
              filterName='Intolerances'
              items={[
                'Dairy',
                'Peanut',
                'Soy',
                'Egg',
                'Gluten',
                'Shellfish',
                'Wheat',
                'Grain',
              ]}
            />

            <Slide
              label='Minimum calories'
              filterName='minCalories'
              min={0}
              max={1000}
              step={25}
              defaultValue={[50]}
              className='mt-1'
            />
            <Slide
              label='Maximum calories'
              filterName='maxCalories'
              min={0}
              max={5000}
              step={50}
              defaultValue={[50]}
              className='mt-1'
            />

            <Button
              type='submit w-full'
              onClick={handleSubmit}
              className='mt-4 bg-green-400'
            >
              Search
            </Button>
          </div>
        </div>
        <div className='mx-8 mt-6'>
          <h1 className='text-2xl font-bold'>Results</h1>
          {loading ? (
            <RiseLoader color={'#66BB6A'} className='py-12 px-4' />
          ) : recipes.length === 0 ? (
            <h2 className='text-xl font-bold'>
              Try searching for some recipes
            </h2>
          ) : (
            <Carousel className='w-full'>
              <CarouselContent>
                {recipes.map((recipe, idx) => (
                  <CarouselItem key={idx}>
                    <div className='p-1'>
                      <Card className='w-full'>
                        <CardContent className='flex-col w-full py-4'>
                          <div className='flex space-x-2 items-center'>
                            <a href={recipe.sourceUrl}>
                              {' '}
                              <LinkIcon className='' />{' '}
                            </a>
                            <h1 className='text-2xl font-bold'>
                              {recipe.title} ({idx + 1}/{recipes.length})
                            </h1>
                          </div>
                          <div className='px-4 pb-4 pt-2 mr-0'>
                            <li>Ready in {recipe.readyInMinutes} minutes</li>
                            <li>Servings for {recipe.servings} people</li>
                            <li>{recipe.healthScore} health score</li>
                            <li>Sourced by {recipe.sourceName}</li>
                          </div>
                          <div className='mr-2'>
                            {recipe.nutrition.nutrients.map((nutrient, ridx) =>
                              importantNutrients.includes(
                                nutrient.name.toLowerCase(),
                              ) ? (
                                <Badge
                                  key={`recipe-${idx}-nutrients-${ridx}`}
                                  variant='outline'
                                >{`${nutrient.amount}${nutrient.unit} ${nutrient.name.toLowerCase()}`}</Badge>
                              ) : (
                                <></>
                              ),
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </div>
    </main>
  );
}
