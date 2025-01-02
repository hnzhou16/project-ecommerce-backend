### for ... of/in...
for ... of ... -> get values
for ... in ... -> get keys

### await
const existingSwatch = await SwatchRepo.findOne({where: {name: swatchData.name}})


## Entity
### @OneToMany
index id will be shown in the 'Many' side


## QueryBuilder
### getRawMany() vs getMany()
return raw database (plain js objects) rows vs full entity instance (an entity)

const rawResults = await getRepository(ProductCategoryEntity)
.createQueryBuilder('category')
.select('category.name', 'name')
.getRawMany();

// Output: [{ name: "Men's Clothing" }, { name: "Women's Clothing" }]

const entities = await getRepository(ProductCategoryEntity)
.createQueryBuilder('category')
.getMany();

// Output:
// [
//   ProductCategoryEntity { id: 1, name: "Men's Clothing" },
//   ProductCategoryEntity { id: 2, name: "Women's Clothing" }
// ]
