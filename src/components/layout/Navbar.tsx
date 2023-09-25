import { Container, Flex } from "@chakra-ui/react";
import { DarkModeSwitch } from "../DarkModeSwitch";

export const Navbar = () => {
  return (
    <Container>
      <Flex alignItems="end" placeItems="end" justifyItems="end" justifyContent="end">
        <DarkModeSwitch />
      </Flex>
    </Container>
  );
}