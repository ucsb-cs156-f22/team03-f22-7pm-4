package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBDiningCommonsMenuItemController.class)
@Import(TestConfig.class)
public class UCSBDiningCommonsMenuItemControllerTests extends ControllerTestCase{

        @MockBean
        UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

        @MockBean
        UserRepository userRepository;

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/UCSBDiningCommonsMenuItem/all"))
                            .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/UCSBDiningCommonsMenuItem/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/UCSBDiningCommonsMenuItem?id=1"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/ucsbdiningcommons/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/UCSBDiningCommonsMenuItem/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/UCSBDiningCommonsMenuItem/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

            UCSBDiningCommonsMenuItem menuItem = UCSBDiningCommonsMenuItem.builder()
                                .name("dsfsdf")
                                .diningCommonsCode("dsfsdfd")
                                .station("dsfsdf")
                                .build();
            when(ucsbDiningCommonsMenuItemRepository.findById(eq((long)1))).thenReturn(Optional.of(menuItem));

            MvcResult response = mockMvc.perform(get("/api/UCSBDiningCommonsMenuItem?id=1"))
                        .andExpect(status().isOk()).andReturn();

            verify(ucsbDiningCommonsMenuItemRepository, times(1)).findById(eq((long)1));
            String expectedJson = mapper.writeValueAsString(menuItem);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ucsbDiningCommonsMenuItemRepository.findById(eq((long)2))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBDiningCommonsMenuItem?id=2"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ucsbDiningCommonsMenuItemRepository, times(1)).findById(eq((long)2));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBDiningCommonsMenuItem with id 2 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_ucsbdiningcommons_menu_item() throws Exception {

                // arrange

                UCSBDiningCommonsMenuItem carrillo = UCSBDiningCommonsMenuItem.builder()
                                .name("dsfsdf")
                                .diningCommonsCode("dsfsdfd")
                                .station("dsfsdf")
                                .build();

                UCSBDiningCommonsMenuItem dlg = UCSBDiningCommonsMenuItem.builder()
                                .name("dsfsdf")
                                .diningCommonsCode("dsfsdfjd")
                                .station("dsfsdf")
                                .build();

                ArrayList<UCSBDiningCommonsMenuItem> expectedCommons = new ArrayList<>();
                expectedCommons.addAll(Arrays.asList(carrillo, dlg));

                when(ucsbDiningCommonsMenuItemRepository.findAll()).thenReturn(expectedCommons);

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBDiningCommonsMenuItem/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbDiningCommonsMenuItemRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedCommons);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_commons_menu_item() throws Exception {
                UCSBDiningCommonsMenuItem ortega = UCSBDiningCommonsMenuItem.builder()
                .name("dsfsdf")
                .diningCommonsCode("dsfsdfd")
                .station("dsfsdf")
                .build();

                when(ucsbDiningCommonsMenuItemRepository.save(eq(ortega))).thenReturn(ortega);

                MvcResult response = mockMvc.perform(
                                post("/api/UCSBDiningCommonsMenuItem/post?name=dsfsdf&diningCommonsCode=dsfsdfd&station=dsfsdf")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                verify(ucsbDiningCommonsMenuItemRepository, times(1)).save(ortega);
                String expectedJson = mapper.writeValueAsString(ortega);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_date() throws Exception {
            UCSBDiningCommonsMenuItem ortega = UCSBDiningCommonsMenuItem.builder()
                .name("dsfsdf")
                .diningCommonsCode("dsfsdfd")
                .station("dsfsdf")
                .build();

                when(ucsbDiningCommonsMenuItemRepository.findById(eq((long)3))).thenReturn(Optional.of(ortega));

                MvcResult response = mockMvc.perform(
                                delete("/api/UCSBDiningCommonsMenuItem/?id=3")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                verify(ucsbDiningCommonsMenuItemRepository, times(1)).findById((long)3);
                verify(ucsbDiningCommonsMenuItemRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBDiningCommonsMenuItem with id 3 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_commons_menu_item_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(ucsbDiningCommonsMenuItemRepository.findById(eq((long)1))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/UCSBDiningCommonsMenuItem/?id=1")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbDiningCommonsMenuItemRepository, times(1)).findById((long)1);
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBDiningCommonsMenuItem with id 1 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_commons_menu_item() throws Exception {
                // arrange

                UCSBDiningCommonsMenuItem carrilloOrig = UCSBDiningCommonsMenuItem.builder()
                .name("dsfsdf")
                .diningCommonsCode("dsfsdfd")
                .station("dsfsdf")
                .build();

                UCSBDiningCommonsMenuItem carrilloEdited = UCSBDiningCommonsMenuItem.builder()
                .name("dsfsdfdsd")
                .diningCommonsCode("dsfsdddfd")
                .station("dsfsdddf")
                .build();

                String requestBody = mapper.writeValueAsString(carrilloEdited);

                when(ucsbDiningCommonsMenuItemRepository.findById(eq((long)3))).thenReturn(Optional.of(carrilloOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/UCSBDiningCommonsMenuItem?id=3")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbDiningCommonsMenuItemRepository, times(1)).findById((long)3);
                verify(ucsbDiningCommonsMenuItemRepository, times(1)).save(carrilloEdited); // should be saved with updated info
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_commons_that_does_not_exist() throws Exception {
                // arrange

                UCSBDiningCommonsMenuItem editedCommons = UCSBDiningCommonsMenuItem.builder()
                .name("dsfsdfdsd")
                .diningCommonsCode("dsfsdddfd")
                .station("dsfsdddf")
                .build();

                String requestBody = mapper.writeValueAsString(editedCommons);

                when(ucsbDiningCommonsMenuItemRepository.findById(eq((long)3))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/UCSBDiningCommonsMenuItem?id=3")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbDiningCommonsMenuItemRepository, times(1)).findById((long)3);
                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBDiningCommonsMenuItem with id 3 not found", json.get("message"));

        }

}