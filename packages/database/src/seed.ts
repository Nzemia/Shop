import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supportMessage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create SUPERADMIN user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const superAdmin = await prisma.user.create({
    data: {
      email: "frank@jengashop.com",
      username: "frank",
      password: hashedPassword,
      role: "SUPERADMIN"
    }
  });

  // Create ADMIN user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@jengashop.com",
      username: "admin",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  // Create regular users
  const userPassword = await bcrypt.hash("user123", 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        username: "john_doe",
        password: userPassword,
        role: "USER"
      }
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        username: "jane_smith",
        password: userPassword,
        role: "USER"
      }
    }),
    prisma.user.create({
      data: {
        email: "mike@example.com",
        username: "mike_johnson",
        password: userPassword,
        role: "USER"
      }
    })
  ]);

  console.log("👥 Created users:", {
    superAdmin: superAdmin.username,
    admin: admin.username,
    users: users.length
  });

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'MacBook Pro 14"',
        description: "Latest MacBook Pro with M2 chip, 16GB RAM, 512GB SSD",
        price: 2499.99,
        category: "Electronics",
        stock: 10,
        images: [
          "https://via.placeholder.com/400x300/000000/FFFFFF?text=MacBook+Pro"
        ],
        variants: {
          colors: ["Silver", "Space Gray"],
          storage: ["512GB", "1TB"]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: "iPhone 15 Pro",
        description: "Latest iPhone with A17 Pro chip, 128GB storage",
        price: 999.99,
        category: "Electronics",
        stock: 25,
        images: [
          "https://via.placeholder.com/400x300/000000/FFFFFF?text=iPhone+15+Pro"
        ],
        variants: {
          colors: ["Natural Titanium", "Blue Titanium", "White Titanium"],
          storage: ["128GB", "256GB", "512GB"]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: "Nike Air Max 90",
        description: "Classic Nike Air Max 90 sneakers in white/black colorway",
        price: 129.99,
        category: "Shoes",
        stock: 50,
        images: [
          "https://via.placeholder.com/400x300/000000/FFFFFF?text=Nike+Air+Max+90"
        ],
        variants: {
          sizes: ["7", "8", "9", "10", "11", "12"],
          colors: ["White/Black", "Black/White", "Red/White"]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung 55" 4K TV',
        description: "Samsung 55-inch 4K UHD Smart TV with HDR support",
        price: 699.99,
        category: "Electronics",
        stock: 8,
        images: [
          "https://via.placeholder.com/400x300/000000/FFFFFF?text=Samsung+55%22+4K+TV"
        ],
        variants: {
          sizes: ['55"', '65"', '75"']
        }
      }
    }),
    prisma.product.create({
      data: {
        name: "Instant Pot Duo 7-in-1",
        description:
          "Multi-functional pressure cooker, slow cooker, rice cooker",
        price: 89.99,
        category: "Kitchen",
        stock: 30,
        images: [
          "https://via.placeholder.com/400x300/000000/FFFFFF?text=Instant+Pot"
        ],
        variants: {
          sizes: ["6 Quart", "8 Quart"]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: "Levi's 501 Jeans",
        description: "Classic straight-leg jeans in indigo wash",
        price: 69.99,
        category: "Clothes",
        stock: 75,
        images: [
          "https://via.placeholder.com/400x300/000000/FFFFFF?text=Levi%27s+501+Jeans"
        ],
        variants: {
          sizes: ["28", "30", "32", "34", "36", "38"],
          colors: ["Indigo", "Black", "Light Blue"]
        }
      }
    })
  ]);

  console.log("📦 Created products:", products.length);

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: "ORD-2024-001",
        userId: users[0].id,
        totalAmount: 2499.99,
        status: "PAID",
        trackingStatus: "SHIPPED",
        paymentMethod: "MPESA",
        paymentStatus: "COMPLETED",
        phoneNumber: "+254700000001",
        shippingAddress: {
          name: "John Doe",
          phone: "+254700000001",
          address: "123 Main St, Nairobi",
          city: "Nairobi",
          county: "Nairobi"
        },
        mpesaTransactionId: "MPE12345678",
        orderItems: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: 2499.99
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-2024-002",
        userId: users[1].id,
        totalAmount: 1129.98,
        status: "PAID",
        trackingStatus: "DELIVERED",
        paymentMethod: "MPESA",
        paymentStatus: "COMPLETED",
        phoneNumber: "+254700000002",
        shippingAddress: {
          name: "Jane Smith",
          phone: "+254700000002",
          address: "456 Oak Ave, Mombasa",
          city: "Mombasa",
          county: "Mombasa"
        },
        mpesaTransactionId: "MPE87654321",
        orderItems: {
          create: [
            {
              productId: products[1].id,
              quantity: 1,
              price: 999.99
            },
            {
              productId: products[2].id,
              quantity: 1,
              price: 129.99
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-2024-003",
        userId: users[2].id,
        totalAmount: 159.98,
        status: "PENDING",
        trackingStatus: "PENDING",
        paymentMethod: "DOOR_DELIVERY",
        paymentStatus: "PENDING",
        phoneNumber: "+254700000003",
        shippingAddress: {
          name: "Mike Johnson",
          phone: "+254700000003",
          address: "789 Pine Rd, Kisumu",
          city: "Kisumu",
          county: "Kisumu"
        },
        orderItems: {
          create: [
            {
              productId: products[4].id,
              quantity: 1,
              price: 89.99
            },
            {
              productId: products[5].id,
              quantity: 1,
              price: 69.99
            }
          ]
        }
      }
    })
  ]);

  console.log("📋 Created orders:", orders.length);

  // Create sample support messages
  const supportMessages = await Promise.all([
    prisma.supportMessage.create({
      data: {
        userId: users[0].id,
        email: users[0].email,
        username: users[0].username,
        subject: "Order Tracking Issue",
        message:
          "I need help with my recent order. The tracking shows it's shipped but I haven't received any updates.",
        status: "OPEN",
        priority: "MEDIUM",
        isRead: false
      }
    }),
    prisma.supportMessage.create({
      data: {
        userId: users[1].id,
        email: users[1].email,
        username: users[1].username,
        subject: "Excellent Service Feedback",
        message:
          "Great service! My order arrived quickly and everything was perfect. Thank you!",
        status: "RESOLVED",
        priority: "LOW",
        isRead: true
      }
    }),
    prisma.supportMessage.create({
      data: {
        userId: users[2].id,
        email: users[2].email,
        username: users[2].username,
        subject: "Order Cancellation Request",
        message:
          "I would like to cancel my order ORD-2024-003. Please let me know the process.",
        status: "OPEN",
        priority: "HIGH",
        isRead: false
      }
    })
  ]);

  console.log("💬 Created support messages:", supportMessages.length);

  // Create sample support responses
  const supportResponses = await Promise.all([
    prisma.supportResponse.create({
      data: {
        messageId: supportMessages[0].id,
        adminId: admin.id,
        adminName: admin.username,
        response: "Hi John! I've checked your order status and I can see it's currently in transit. You should receive it within 2-3 business days. I'll send you the updated tracking information via email."
      }
    }),
    prisma.supportResponse.create({
      data: {
        messageId: supportMessages[1].id,
        adminId: admin.id,
        adminName: admin.username,
        response: "Thank you so much for your positive feedback, Jane! We're thrilled to hear that you had a great experience with us. We appreciate your business and look forward to serving you again!"
      }
    }),
    prisma.supportResponse.create({
      data: {
        messageId: supportMessages[2].id,
        adminId: superAdmin.id,
        adminName: superAdmin.username,
        response: "Hi Mike! I understand you'd like to cancel order ORD-2024-003. Since it's still pending and hasn't been processed yet, I can cancel it for you right away. The cancellation will be processed within 24 hours."
      }
    })
  ]);

  console.log("💭 Created support responses:", supportResponses.length);

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(
    `- Users: ${1 + 1 + users.length} (1 SUPERADMIN, 1 ADMIN, ${users.length
    } USER)`
  );
  console.log(`- Products: ${products.length}`);
  console.log(`- Orders: ${orders.length}`);
  console.log(`- Support Messages: ${supportMessages.length}`);
  console.log("\n🔐 Login Credentials:");
  console.log("SUPERADMIN: superadmin@jengashop.com / admin123");
  console.log("ADMIN: admin@jengashop.com / admin123");
  console.log("USER: john@example.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    //process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
