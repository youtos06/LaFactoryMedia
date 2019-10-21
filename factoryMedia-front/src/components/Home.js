import React from "react";
import LaFactory from "./../LaFactory.jpg";

export default function Home() {
  return (
    <div>
      <React.Fragment>
        <header
          className="masthead"
          style={{
            padding: 10,
            backgroundImage: `url(${LaFactory})`,
            width: "100%",
            height: 700,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
          }}
        >
          <div className="container h-100">
            <div className="row h-100 align-items-center justify-content-center text-center">
              <div className="col-lg-10 align-self-end">
                <h1 className="text-uppercase text-white font-weight-bold">
                  LaFactory By ScreenDy
                </h1>
                <hr className="divider my-4"></hr>
              </div>
              <div className="col-lg-8 align-self-baseline">
                <p className="text-white-75 font-weight-light mb-5 font-weight-bold">
                  We accelerate collaboration between tech Startups and Big
                  Corporates in Africa
                </p>
                <a
                  className="btn btn-danger btn-xl js-scroll-trigger"
                  href="http://lafactory.co/"
                >
                  Visit our website for more info
                </a>
              </div>
            </div>
          </div>
        </header>
      </React.Fragment>
      <section className="page-section" id="services" style={{ margin: 30 }}>
        <div className="container">
          <h2 className="text-center mt-0">At Your Service</h2>
          <hr className="divider my-4"></hr>
          <div className="row">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fa fa-4x fa-diamond text-primary mb-4"></i>
                <h3 className="h4 mb-2">ScreenDY App</h3>
                <p className="text-muted mb-0">
                  Our App is updated regularly to keep it bug free!
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fa fa-4x fa-laptop text-primary mb-4"></i>
                <h3 className="h4 mb-2">Up to Date</h3>
                <p className="text-muted mb-0">
                  All dependencies are kept current to keep things fresh.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fa fa-4x fa-globe text-primary mb-4"></i>
                <h3 className="h4 mb-2">Ready to Publish</h3>
                <p className="text-muted mb-0">
                  we publish the even with high quality description/pics /vids
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <i className="fa fa-4x fa-heart text-primary mb-4"></i>
                <h3 className="h4 mb-2">Made with Love</h3>
                <p className="text-muted mb-0">
                  commitement to the client to get the best result
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
