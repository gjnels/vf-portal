import { Prisma, PrismaClient } from '@prisma/client'

const flavors: Prisma.Enumerable<Prisma.FlavorCreateManyInput> = [
	{
		flavor: 'Banana',
		category: 'Fruit'
	},
	{
		flavor: 'Blueberry',
		category: 'Fruit'
	},
	{
		flavor: 'Cantaloupe',
		category: 'Fruit'
	},
	{
		flavor: 'Cherry',
		category: 'Fruit'
	},
	{
		flavor: 'Coconut',
		category: 'Fruit'
	},
	{
		flavor: 'Grape',
		category: 'Fruit'
	},
	{
		flavor: 'Lemon',
		category: 'Fruit'
	},
	{
		flavor: 'Mango',
		category: 'Fruit'
	},
	{
		flavor: 'Orange',
		category: 'Fruit'
	},
	{
		flavor: 'Peach',
		category: 'Fruit'
	},
	{
		flavor: 'Pear',
		category: 'Fruit'
	},
	{
		flavor: 'Pineapple',
		category: 'Fruit'
	},
	{
		flavor: 'Raspberry',
		category: 'Fruit'
	},
	{
		flavor: 'Red Apple',
		category: 'Fruit'
	},
	{
		flavor: 'Strawberry',
		category: 'Fruit'
	},
	{
		flavor: 'Tropical Escape',
		category: 'Fruit'
	},
	{
		flavor: 'Watermelon',
		category: 'Fruit'
	},
	{
		flavor: 'Blue Razzle Berry',
		category: 'Candy'
	},
	{
		flavor: 'Cotton Candy',
		category: 'Candy'
	},
	{
		flavor: 'Gummy',
		category: 'Candy'
	},
	{
		flavor: 'Rainbow Drops',
		category: 'Candy'
	},
	{
		flavor: 'Red Hot Cinnamon',
		category: 'Candy'
	},
	{
		flavor: 'Cigar',
		category: 'Tobacco'
	},
	{
		flavor: 'Classic Tobacco',
		category: 'Tobacco'
	},
	{
		flavor: 'Clove',
		category: 'Tobacco'
	},
	{
		flavor: 'Red Tobacco',
		category: 'Tobacco'
	},
	{
		flavor: 'RY4',
		category: 'Tobacco'
	},
	{
		flavor: 'Sahara Gold Tobacco',
		category: 'Tobacco'
	},
	{
		flavor: 'Shisha',
		category: 'Tobacco'
	},
	{
		flavor: 'Fresh Mint',
		category: 'Menthol'
	},
	{
		flavor: 'Menthol Freeze',
		category: 'Menthol'
	},
	{
		flavor: 'Mighty Menthol',
		category: 'Menthol'
	},
	{
		flavor: 'Peppermint',
		category: 'Menthol'
	},
	{
		flavor: 'Amaretto',
		category: 'Drinks'
	},
	{
		flavor: 'Appletini',
		category: 'Drinks'
	},
	{
		flavor: 'Bourbon',
		category: 'Drinks'
	},
	{
		flavor: 'Chai',
		category: 'Drinks'
	},
	{
		flavor: 'Champagne',
		category: 'Drinks'
	},
	{
		flavor: 'Cola',
		category: 'Drinks'
	},
	{
		flavor: 'Egg Nog',
		category: 'Drinks'
	},
	{
		flavor: 'Energy Drink',
		category: 'Drinks'
	},
	{
		flavor: 'Espresso',
		category: 'Drinks'
	},
	{
		flavor: 'Green Tea',
		category: 'Drinks'
	},
	{
		flavor: 'Java',
		category: 'Drinks'
	},
	{
		flavor: 'Mojito',
		category: 'Drinks'
	},
	{
		flavor: 'Rum',
		category: 'Drinks'
	},
	{
		flavor: 'Butter Pecan',
		category: 'Dessert'
	},
	{
		flavor: 'Cake',
		category: 'Dessert'
	},
	{
		flavor: 'Cheesecake',
		category: 'Dessert'
	},
	{
		flavor: 'Chocolate Delight',
		category: 'Dessert'
	},
	{
		flavor: 'Condensed Milk',
		category: 'Dessert'
	},
	{
		flavor: 'Cookie',
		category: 'Dessert'
	},
	{
		flavor: 'Creme de la Creme',
		category: 'Dessert'
	},
	{
		flavor: 'Custard',
		category: 'Dessert'
	},
	{
		flavor: 'Dulce De Leche',
		category: 'Dessert'
	},
	{
		flavor: 'Fruity Cereal',
		category: 'Dessert'
	},
	{
		flavor: 'Gingerbread',
		category: 'Dessert'
	},
	{
		flavor: 'Glazed Donut',
		category: 'Dessert'
	},
	{
		flavor: 'Graham Cracker',
		category: 'Dessert'
	},
	{
		flavor: 'Hazelnut',
		category: 'Dessert'
	},
	{
		flavor: 'Maple Syrup',
		category: 'Dessert'
	},
	{
		flavor: 'Marshmallow',
		category: 'Dessert'
	},
	{
		flavor: 'Peanut Butter',
		category: 'Dessert'
	},
	{
		flavor: 'Pie Crust',
		category: 'Dessert'
	},
	{
		flavor: 'Sinfully Cinnamon',
		category: 'Dessert'
	},
	{
		flavor: 'Smooth Chocolate',
		category: 'Dessert'
	},
	{
		flavor: 'Toffee',
		category: 'Dessert'
	},
	{
		flavor: 'Vanilla Bean Ice Cream',
		category: 'Dessert'
	},
	{
		flavor: 'Very Vanilla',
		category: 'Dessert'
	},
	{
		flavor: 'Waffle',
		category: 'Dessert'
	}
]

const locations: Prisma.Enumerable<Prisma.LocationCreateManyInput> = [
	{
		name: 'All'
	},
	{
		name: 'Campus',
		address: '2471 N High St\nColumbus, OH 43202',
		phone: '6146707904'
	},
	{
		name: 'Gahanna',
		address: '303 S Hamilton Rd\nColumbus, OH 43230',
		phone: '6147064603'
	},
	{
		name: 'Grove City',
		address: '2241 Stringtown Rd\nGrove City, OH 43123',
		phone: '6149910341'
	},
	{
		name: 'Hilliard',
		address: '1728 Hilliard-Rome Rd\nHilliard, OH 43026',
		phone: '6142191793'
	},
	{
		name: 'Polaris',
		address: '1077 Polaris Pkwy\nColumbus, OH 43240',
		phone: '6149477561'
	},
	{
		name: 'Reynoldsburg',
		address: '2087 Baltimore Reynoldsburg Rd\nReynoldsburg, OH 43068',
		phone: '6146268732'
	}
]

const prisma = new PrismaClient()
const seed = async () => {
	await prisma.customBlend.deleteMany()
	await prisma.flavor.deleteMany()
	await prisma.promo.deleteMany()
	await prisma.location.deleteMany()

	const locationsResult = await prisma.location.createMany({
		data: locations
	})
	console.log('locations?', locationsResult)

	const flavorResult = await prisma.flavor.createMany({ data: flavors })
	console.log('flavors result?', flavorResult)

	const blendsResult = await prisma.customBlend.createMany({
		data: [
			{
				name: 'Juicy Fruit',
				flavor1: 'Watermelon',
				shots1: 2,
				flavor2: 'Strawberry',
				shots2: 1,
				approved: true,
				createdById: '65c4f802-828c-41e8-94cb-eebc693bc6fd'
			},
			{
				name: 'Razzle Punch',
				flavor1: 'Blue Razzle Berry',
				shots1: 1,
				flavor2: 'Mango',
				shots2: 1,
				flavor3: 'Strawberry',
				shots3: 1,
				approved: true,
				createdById: '65c4f802-828c-41e8-94cb-eebc693bc6fd'
			},
			{
				name: 'Ohioan Punch',
				flavor1: 'Grape',
				shots1: 1,
				flavor2: 'Strawberry',
				shots2: 1,
				flavor3: 'Watermelon',
				shots3: 1,
				createdById: '65c4f802-828c-41e8-94cb-eebc693bc6fd'
			}
		]
	})
	console.log('blends?', blendsResult)

	const weekPromo = await prisma.promo.create({
		data: {
			title: 'Blend of the Week',
			sale: '30mL: $15.99\n60mL: $19.99',
			notes: 'Nicotine packets sold separately.',
			validFrom: new Date(2023, 1, 1),
			validUntil: new Date(2023, 1, 31),
			createdBy: { connect: { id: '65c4f802-828c-41e8-94cb-eebc693bc6fd' } },
			blend: {
				create: {
					name: 'Just a Double Shot of Classic Tobacco',
					flavor1: 'Classic Tobacco',
					shots1: 2,
					approved: true,
					createdById: '65c4f802-828c-41e8-94cb-eebc693bc6fd'
				}
			}
		}
	})
	console.log('week promo?', weekPromo)
	const monthPromo = await prisma.promo.create({
		data: {
			title: 'Juice of the Month',
			subtitle: 'Holiday Flavors',
			validFrom: new Date(2023, 1, 1),
			validUntil: new Date(2023, 1, 31),
			createdBy: { connect: { id: '65c4f802-828c-41e8-94cb-eebc693bc6fd' } },
			sale: '20% off',
			notes:
				'Included flavors:\n· Propaganda - Cookie Butter\n· The Milk - Cinnamon (including disposable)\n· Glas Basix - Butterscotch Reserve\n· Glas Basix - Sugar Cookie\n· Silverback - Rocky\n\nIf any of these are included in a B3G1, this discount will not apply.'
		}
	})
	console.log('month promo?', monthPromo)

	const packets = [
		{
			level: 45,
			color: 'Yellow',
			salt: false
		},
		{
			level: 90,
			color: 'Green',
			salt: false
		},
		{
			level: 180,
			color: 'Blue',
			salt: false
		},
		{
			level: 270,
			color: 'Red',
			salt: false
		},
		{
			level: 360,
			color: 'Purple',
			salt: false
		},
		{
			level: 540,
			color: 'Brown',
			salt: false
		},
		{
			level: 720,
			color: 'Black',
			salt: false
		},
		{
			level: 1440,
			color: 'Orange',
			salt: false
		},
		{
			level: 750,
			color: 'Pink',
			salt: true
		},
		{
			level: 1500,
			color: 'Grey',
			salt: true
		}
	]

	const uploadedPackets = await prisma.nicotinePacket.createMany({
		data: packets
	})
	console.log('nicotine packets:', uploadedPackets)
}

seed()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.log(e)
		await prisma.$disconnect()
		process.exit(1)
	})
