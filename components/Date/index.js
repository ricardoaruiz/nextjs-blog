import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';

const Date = ({ dateString }) => {
  const date = useMemo(() => {
    return parseISO(dateString);
  }, [dateString]);

  const formattedDate = useMemo(() => {
    return format(date, 'LLLL d, yyyy');
  }, [date]);

  return <div>{formattedDate}</div>;
};

Date.propTypes = {
  dateString: PropTypes.string.isRequired,
};

export default Date;
