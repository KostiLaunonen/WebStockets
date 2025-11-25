import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#1b2029',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  priceBox: {
    minWidth: 160,
    minHeight: 70,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 6,
    alignSelf: 'flex-start',
    padding: 2,
    margin: 10,
    backgroundColor: '#2d3645'
  },
  priceText: {
    fontSize: 20,
    color: 'white',
    alignContent: 'center'
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  baseText: {
    fontSize: 22,
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
  },
  detailsBox: {
    minWidth: '60%',
    minHeight: '50%',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#2d3645',
    borderRadius: 10,
    color: 'white',
  },
  detailsTitle: {
    fontSize: 22,
    color: 'white',
    marginBottom: 10,
  },
  sideWidget: {
    position: 'absolute',
    alignItems: 'flex-start',
    top: 30,
    left: 30,
  },
  sideBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '15%',
    paddingRight: 10,
    paddingTop: 10,
    backgroundColor: '#2d3645',
    zIndex: 10,
  },
  sideBarHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 95,
    paddingBottom: 25,
  },
  sideBarContent: {
    flexDirection: 'column',
    padding: 5,
  },
  sideBarDivider: {
    height: 1,
    backgroundColor: 'white',
    width: '90%',
    marginTop: 5,
    marginBottom: 18,
    marginLeft: 15,
  },
  sideBarItem: {
    flexDirection: 'row',
     paddingLeft: 45,
  }
});
