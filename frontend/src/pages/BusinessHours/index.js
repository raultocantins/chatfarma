import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const daysOfWeek = [{ id: 1, label: 'Segunda-feira', isActive: false },
{ id: 2, label: 'Terça-feira', isActive: false }, { id: 3, label: 'Quarta-feira', isActive: false }, { id: 4, label: 'Quinta-feira', isActive: false }, { id: 5, label: 'Sexta-feira', isActive: false }, { id: 6, label: 'Sábado', isActive: false }, { id: 7, label: 'Domingo', isActive: false }
]
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function BusinessHours() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };


  return (

    <List className={classes.root}>
      {daysOfWeek.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value.id} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.label} />
            <ListItem>
            </ListItem>

          </ListItem>
        );
      })}
    </List>

  );
}

