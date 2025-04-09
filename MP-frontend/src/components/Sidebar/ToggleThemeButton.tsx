import React from 'react';
import { Button } from 'antd';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

interface ToggleThemeButtonProps {
  darkTheme: boolean;
  onToggle: () => void;
}

const ToggleThemeButton: React.FC<ToggleThemeButtonProps> = ({ darkTheme, onToggle }) => {
  return (
    <Button
      type="text"
      icon={darkTheme ? <HiOutlineSun/> : <HiOutlineMoon />}
      onClick={onToggle}
      className="theme-toggle-button"
    />
  );
};

export default ToggleThemeButton;
