import React from 'react';
import axios from 'axios';

const getGradient = greatest => work => {
  const low = greatest * 0.25;
  const mid = greatest * 0.5;
  const high = greatest * 0.75;

  if (work === 0) return 0;
  if (work < low) return 1;
  if (work < mid) return 2;
  if (work < high) return 3;
  return 4;
};

export default class Heat extends React.Component {
  state = {
    data: []
  };

  async componentDidMount() {
    const res = await axios.get('https://api.github.com/repos/facebook/react/stats/commit_activity');
    this.setState({ data: res.data });
  }

  getData() {
    const { data } = this.state;

    const greatest = data.reduce((acc, { days }) => {
      const greatestDay = days.reduce((acc, n) => Math.max(acc, n), 0);
      return Math.max(acc, greatestDay);
    }, 0);
    const getGrad = getGradient(greatest);

    const grid = [];

    data.forEach(({ days }) => {
      grid.push(days.map(n => getGrad(n)));
    });

    return grid;
  }

  render() {
    const data = this.getData();

    return (
      <div className="heatmap">
        {data.map((week, i) => {
          return (
            <div className="week">
              {week.map(heat => (
                <div className={`day-${heat}`} />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}
