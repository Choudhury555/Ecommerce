import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';
import {Layout} from '../components'
import { StateContext } from '../context/StateContext';

export default function App({ Component, pageProps }) {
  return (
    <StateContext>
      <Layout>
        <Toaster />{/*to get the pop-up notification*/}
        <Component {...pageProps} />{/*This <Component /> means the component/page you are currently on(like if you are at Home page then this <Component /> is your Home page*/}
      </Layout>{/*so we are wrapping our current page(like Home,Productdetails) with the <Layout /> components*/}
    </StateContext>
  )
}
