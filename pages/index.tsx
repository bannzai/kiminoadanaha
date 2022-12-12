import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button, Textarea, Text } from "@chakra-ui/react";
import React from "react";

export default function Home() {
  const [value, setValue] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  return (
    <>
      <Text mb="8px">Tweet: {value}</Text>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder="Here is a sample placeholder"
        size="sm"
      />

      <Button colorScheme="teal" size="md">
        Button
      </Button>
    </>
  );
}
