import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Password123!";

const RESTAURANTS = [
  {
    admin: {
      name: "Double Portion Team",
      email: "admin@doubleportion.cafapp.test",
      phone: "+2348010000001",
      username: "doubleportion_admin",
    },
    restaurant: { name: "Double Portion", status: "online", queueStatus: "low" },
    items: [
      { category: "main_dish", name: "Jollof Rice & Chicken", description: "Smoky party jollof rice with grilled chicken.", price: "2500.00" },
      { category: "main_dish", name: "Fried Rice & Beef", description: "Vegetable fried rice with beef strips.", price: "2500.00" },
      { category: "drink", name: "Chapman", description: "Chilled house Chapman.", price: "800.00" },
    ],
  },
  {
    admin: {
      name: "FoodMart Team",
      email: "admin@foodmart.cafapp.test",
      phone: "+2348010000002",
      username: "foodmart_admin",
    },
    restaurant: { name: "FoodMart", status: "online", queueStatus: "medium" },
    items: [
      { category: "main_dish", name: "Amala & Ewedu", description: "Amala served with ewedu and gbegiri.", price: "2000.00" },
      { category: "main_dish", name: "Spaghetti Bolognese", description: "Spaghetti in rich tomato meat sauce.", price: "1800.00" },
      { category: "drink", name: "Zobo", description: "Chilled hibiscus zobo drink.", price: "500.00" },
    ],
  },
  {
    admin: {
      name: "Manna Palace Team",
      email: "admin@mannapalace.cafapp.test",
      phone: "+2348010000003",
      username: "mannapalace_admin",
    },
    restaurant: { name: "Manna Palace", status: "offline", queueStatus: "high" },
    items: [
      { category: "main_dish", name: "Pounded Yam & Egusi", description: "Pounded yam with egusi soup and assorted meat.", price: "2800.00" },
      { category: "main_dish", name: "Fried Rice & Turkey", description: "Fried rice with grilled turkey.", price: "3000.00" },
      { category: "drink", name: "Smoothie", description: "Mixed fruit smoothie.", price: "900.00" },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: "customer@cafapp.test" },
    update: {},
    create: {
      role: "customer",
      name: "Demo Customer",
      email: "customer@cafapp.test",
      phone: "+2348010000004",
      username: "demo_customer",
      gender: "other",
      address: "12 Campus Road",
      passwordHash,
    },
  });

  for (const { admin, restaurant, items } of RESTAURANTS) {
    const adminUser = await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        role: "admin",
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        username: admin.username,
        gender: "other",
        address: "Food Court",
        passwordHash,
      },
    });

    const createdRestaurant = await prisma.restaurant.upsert({
      where: { adminId: adminUser.id },
      update: {},
      create: { adminId: adminUser.id, ...restaurant },
    });

    for (const item of items) {
      const existing = await prisma.menuItem.findFirst({
        where: { restaurantId: createdRestaurant.id, name: item.name },
      });
      if (!existing) {
        await prisma.menuItem.create({ data: { restaurantId: createdRestaurant.id, ...item } });
      }
    }
  }

  console.log("Seed complete. All demo accounts use the password:", DEMO_PASSWORD);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
