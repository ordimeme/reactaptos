import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
// Internal pages
import { Mint } from "@/pages/Mint";
import Markets from "./pages/MarketsPage";
import { CreateTokens } from "./pages/CreateTokens";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { Stake } from "@/pages/Stake"
import { CreateFungibleAsset } from "@/pages/CreateFungibleAsset";
import { MyFungibleAssets } from "@/pages/MyFungibleAssets";
import TokenPage from "./pages/TokenPage/index";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Markets />,
      },
      {
        path: "markets",
        element: <Markets />,
      },
      {
        path: "create",
        element: <CreateTokens />,
      },
      {
        path: "mint",
        element: <Mint />,
      },
      {
        path: "create-asset",
        element: <CreateFungibleAsset />,
      },
      {
        path: "my-assets",
        element: <MyFungibleAssets />,
      },
      {
        path: "stake",
        element: <Stake />,
      },
      {
        path: "token/:id",
        element: <TokenPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="overflow-y-scroll">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;