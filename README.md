# DummyJSON Dashboard App

A minimalist dashboard app built with Expo Router and React Native. Features authentication, product management, and a clean white/gray UI design.

![login](./public/screenshots/login.png)
![home](./public/screenshots/home.png)
![account](./public/screenshots/account.png)
![products](./public/screenshots/product-list.png)
![detail](./public/screenshots/detail.png)
![delete](./public/screenshots/delete.png)
![update](./public/screenshots/update.png)

## ✨ Features

- 🔐 **Secure Authentication** - Login with dummyjson API, token persistence (SecureStore on mobile, localStorage on web)
- 📦 **Product Management** - View, search, add, edit, and delete products
- 👤 **User Profile** - Display account information with logout functionality
- 🎨 **Minimalist Design** - Clean white and gray color scheme
- 📱 **Bottom Navigation** - Home, Products, and Account tabs
- 🔍 **Search** - Real-time product search functionality
- 🌙 **Dark Mode** - Supports light and dark themes
- 🌐 **Cross-Platform** - Works on iOS, Android, and Web
- 📱 **Android Ready** - Proper status bar and navigation bar handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app (for testing on your phone)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Open the App

- **Press `w`** - Open in web browser (fastest for development)
- **Press `a`** - Open in Android emulator
- **Press `i`** - Open in iOS simulator
- **Scan QR code** - Open in Expo Go on your phone

> **Note**: The app works on all platforms! On web, tokens are stored in localStorage. On mobile, they use SecureStore for better security.

## 📱 Demo Credentials

```
Username: emilys
Password: emilyspass
```

More test users available at [dummyjson.com/users](https://dummyjson.com/users)

## 📸 Screenshots

### Login Screen
<img src="screenshots/login.png" alt="Login Screen" width="300"/>

### Home Screen
<img src="screenshots/home.png" alt="Home Screen" width="300"/>

### Products List
<img src="screenshots/products.png" alt="Products List" width="300"/>

### Product Details
<img src="screenshots/product-detail.png" alt="Product Details" width="300"/>

### Add/Edit Product Form
<img src="screenshots/product-form.png" alt="Product Form" width="300"/>

### Account Screen
<img src="screenshots/account.png" alt="Account Screen" width="300"/>

---

### How to Add Screenshots

1. Create a `screenshots` folder in the project root:
   ```bash
   mkdir screenshots
   ```

2. Take screenshots from the app:
   - **Web**: Press `w` to open in browser, then use screenshot tool
   - **Android Emulator**: Use Android Studio's screenshot tool
   - **iOS Simulator**: Press `Cmd + Shift + 4` on Mac
   - **Device**: Use your phone's screenshot function

3. Save images as:
   - `login.png` - Login screen
   - `home.png` - Home screen with user info
   - `products.png` - Product list with search
   - `product-detail.png` - Product details page
   - `product-form.png` - Add/edit product form
   - `account.png` - Account profile screen

4. Place them in the `screenshots/` folder

5. Update this README with your actual screenshots!

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Expo Router** | File-based navigation |
| **React Native** | Mobile app framework |
| **TypeScript** | Type safety |
| **TanStack Query** | Data fetching & caching |
| **Zustand** | State management |
| **Expo SecureStore** | Secure token storage |
| **dummyjson API** | Backend data source |

## 📁 Project Structure

```
app/
├── _layout.tsx              # Root layout with providers
├── auth/
│   └── login.tsx            # Login screen
└── (dashboard)/
    ├── _layout.tsx          # Tab navigation (Home, Products, Account)
    ├── index.tsx            # Home screen
    ├── account.tsx          # Account screen
    └── product/
        ├── _layout.tsx      # Product stack navigator
        ├── index.tsx        # Product list
        ├── [id].tsx         # Product details
        └── form.tsx         # Add/Edit product

lib/
├── api.ts                   # API client with auth
├── api/
│   ├── auth/                # Auth API functions
│   └── products/            # Product API functions
└── navigation.ts            # Navigation helpers

stores/
├── authStore.ts             # Auth state management
└── productStore.ts          # Product state management

components/                   # Reusable UI components
constants/
└── theme.ts                 # App theme configuration
```

## 🎯 Main Features

### Authentication Flow
- Login screen with validation
- Secure token storage (SecureStore)
- Auto-restore session on app restart
- Protected routes with redirect

### Products Tab
- Browse all products from API
- Search products by keyword
- Floating action button to add products
- Tap product to view details
- Edit and delete functionality

### Account Tab
- Display user profile information
- Full name, username, email
- Secure logout with confirmation

## 🌐 API Endpoints

This app uses the free [dummyjson.com](https://dummyjson.com) API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User authentication |
| `/auth/me` | GET | Current user info |
| `/products` | GET | List all products |
| `/products/search?q=` | GET | Search products |
| `/products/:id` | GET | Get single product |
| `/products/add` | POST | Add product (simulated) |
| `/products/:id` | PUT | Update product (simulated) |
| `/products/:id` | DELETE | Delete product (simulated) |

> **Note**: Product add/edit/delete operations are simulated by dummyjson and don't persist on their server.

## 📤 Sharing with Friends

### Quick Share (Expo Go)
```bash
npx expo start --tunnel
```
Share the QR code or URL with your friend!

### Build Standalone App
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

See [SHARE_WITH_FRIEND.md](./SHARE_WITH_FRIEND.md) for detailed instructions.

## 🎨 Customization

### Change Theme Colors

Edit `constants/theme.ts`:

```typescript
export const Colors = {
  light: {
    text: '#1F2937',        // Dark gray text
    background: '#FFFFFF',   // White background
    tint: '#6B7280',         // Primary accent
    // ... more colors
  },
  // ...
};
```

### Modify API Endpoint

Edit `lib/api.ts`:

```typescript
const API_BASE = 'https://your-api.com';
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Metro bundler errors | Run `npx expo start --clear` |
| Pod install issues | Run `cd ios && pod install` |
| Tokens not persisting | Check Expo SecureStore is installed |
| Build fails | Make sure all dependencies are installed |

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router Guide](https://docs.expo.dev/router/introduction)
- [React Native Documentation](https://reactnative.dev)
- [dummyjson API Docs](https://dummyjson.com)

## 📝 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Expo**
