import React from "react";
import cls from "./App.css";
import uploadToS3 from "../services/uploadToS3";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const file = this.fileInput.files[0];

    uploadToS3(file, "scans")
      .then(({ url }) => { this.setState({ url }); })
      .catch(() => { this.setState({ url: null }); })
      .then(() => { this.fileInput.value = ""; });
  }

  render() {
    const { url } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="file" ref={(input) => { this.fileInput = input; }} required />
          <input type="submit" />
        </form>
        {url ? <img src={url} className={cls.img} role="presentation" /> : null}
      </div>
    );
  }
}

export default App;
