import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
// Internal pages
import { Mint } from "@/pages/Mint";
import Markets from "./pages/MarketsPage";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { Stake } from "@/pages/Stake"
import { CreateFungibleAsset } from "@/pages/CreateFungibleAsset";
import { MyFungibleAssets } from "@/pages/MyFungibleAssets";
// import { TopBanner } from "./components/TopBanner";
// import { IS_DEV } from "./constants";

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
        path: "/markets",
        element: <Markets />,
      },
      {
        path: "/mint",
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
    ],
  },
]);

function App() {
  return (
    <>
    {/* {IS_DEV && <TopBanner />} */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
