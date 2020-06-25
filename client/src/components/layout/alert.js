import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
/*
--**Interet de connect **--
On reviendrons dans notre composant alert et nous devrons egalement se connecter ici,
 donc fondalement chaque fois que nous souhaitons inetragir avec Redux soit qu'on appele une actions
 ou obtenir state, on doit se connecter a redux
 */

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => {
    return (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    );
  });
Alert.propTypes = {
  alerts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert, // or on a le reducteur alert ( et pour le moment c'est le seul c'est pour cela que j'ai utilisé : state.alert)
});

export default connect(mapStateToProps)(Alert);
