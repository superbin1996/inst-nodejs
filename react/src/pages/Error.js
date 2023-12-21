import Wrapper from '../assets/wrappers/Error'
import img from '../assets/images/not-found.svg'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <Wrapper>
      <div>
        <img src={img} alt="not found" />
        <h3>Ohh! page not found</h3>
        <p> We can't seem to find the page you're looking for</p>
        <Link to='/'>Back home</Link>
      </div>
    </Wrapper>
  )
}
export default Error