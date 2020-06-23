import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar style={{backgroundColor : "#121212"}} className="navbar-expand-sm navbar-toggleable-sm ng-white box-shadow mb-3" light>
          <Container>
            <div>
              <NavbarBrand tag={Link} to="/"  className="mr-1"
                style={{
                  color : "#606060",
                  fontSize : "200%",
                  fontWeight : "999",
                }}>
                JUICEBOX
              </NavbarBrand>
              <NavbarBrand tag={Link} to="/" className="ml-0"
                style={{
                  color : "#0275d8",
                  fontSize : "100%",
                  fontWeight : "999",
                  fontStyle : "oblique",
                }}>
                audioplayer
              </NavbarBrand>
            </div>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} style={{color : "#606060"}} to="/about">About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} style={{color : "#606060"}} to="/">Audio Player</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
