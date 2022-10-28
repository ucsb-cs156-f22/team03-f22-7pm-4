package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Recommendation;
import edu.ucsb.cs156.example.repositories.RecommendationRepository;

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

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RecommendationController.class)
@Import(TestConfig.class)
public class RecommendationControllerTests extends ControllerTestCase {

        @MockBean
        RecommendationRepository recommendationRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/Recommendation/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/Recommendation/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/Recommendation/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/Recommendation?id=1"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/Recommendation/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/Recommendation/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/Recommendation/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime DRdate = LocalDateTime.parse("2022-10-26T22:28:28.373");
                LocalDateTime DNdate = LocalDateTime.parse("2022-10-26T22:28:21.725");

                Recommendation recommendation =Recommendation.builder()
                                .requesterEmail("requester@gmail.com")
                                .professorEmail("professor@gmail.com")
                                .explanation("recommendation is for xyz application")
                                .dateRequested(DRdate)
                                .dateNeeded(DNdate)
                                .done(false)
                                .build();

                when(recommendationRepository.findById(eq(1L))).thenReturn(Optional.of(recommendation));

                // act
                MvcResult response = mockMvc.perform(get("/api/Recommendation?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(recommendationRepository, times(1)).findById(eq(1L));
                String expectedJson = mapper.writeValueAsString(recommendation);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(recommendationRepository.findById(eq(999L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/Recommendation?id=999"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(recommendationRepository, times(1)).findById(eq(999L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Recommendation with id 999 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_recommendations() throws Exception {

                // arrange
                LocalDateTime DRdate1 = LocalDateTime.parse("2022-10-26T22:28:28.373");
                LocalDateTime DNdate1 = LocalDateTime.parse("2022-10-26T22:28:21.725");

                LocalDateTime DRdate2 = LocalDateTime.parse("2022-10-27T22:23:22.453");
                LocalDateTime DNdate2 = LocalDateTime.parse("2022-10-29T22:24:25.223");

                Recommendation one = Recommendation.builder()
                                .requesterEmail("requester1@gmail.com")
                                .professorEmail("professor1@gmail.com")
                                .explanation("recommendation is for xyz1 application")
                                .dateRequested(DRdate1)
                                .dateNeeded(DNdate1)
                                .done(false)
                                .build();

                Recommendation two = Recommendation.builder()
                                .requesterEmail("requester2@gmail.com")
                                .professorEmail("professor2@gmail.com")
                                .explanation("recommendation is for xyz2 application")
                                .dateRequested(DRdate2)
                                .dateNeeded(DNdate2)
                                .done(false)
                                .build();

                ArrayList<Recommendation> expectedRecommendations = new ArrayList<>();
                expectedRecommendations.addAll(Arrays.asList(one, two));

                when(recommendationRepository.findAll()).thenReturn(expectedRecommendations);

                // act
                MvcResult response = mockMvc.perform(get("/api/Recommendation/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(recommendationRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedRecommendations);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_recommendation() throws Exception {
                // arrange
                LocalDateTime DRdate3 = LocalDateTime.parse("2022-10-26T22:28:28.373");
                LocalDateTime DNdate3 = LocalDateTime.parse("2022-10-26T22:28:21.725");

                Recommendation three = Recommendation.builder()
                                .requesterEmail("requester3@gmail.com")
                                .professorEmail("professor3@gmail.com")
                                .explanation("recommendation is for xyz3 application")
                                .dateRequested(DRdate3)
                                .dateNeeded(DNdate3)
                                .done(true)
                                .build();

                when(recommendationRepository.save(eq(three))).thenReturn(three);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/Recommendation/post?requesterEmail=requester3@gmail.com&professorEmail=professor3@gmail.com&explanation=recommendation is for xyz3 application&dateRequested=2022-10-26T22:28:28.373&dateNeeded=2022-10-26T22:28:21.725&done=true")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRepository, times(1)).save(three);
                String expectedJson = mapper.writeValueAsString(three);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_recommendation() throws Exception {
                // arrange
                LocalDateTime DRdate1 = LocalDateTime.parse("2022-10-26T22:28:28.373");
                LocalDateTime DNdate1 = LocalDateTime.parse("2022-10-26T22:28:21.725");

                Recommendation one = Recommendation.builder()
                                .requesterEmail("requester1@gmail.com")
                                .professorEmail("professor1@gmail.com")
                                .explanation("recommendation is for xyz1 application")
                                .dateRequested(DRdate1)
                                .dateNeeded(DNdate1)
                                .done(false)
                                .build();

                when(recommendationRepository.findById(eq(1L))).thenReturn(Optional.of(one));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/Recommendation?id=1")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRepository, times(1)).findById(1L);
                verify(recommendationRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("Recommendation with id 1 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_ucsbdate_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(recommendationRepository.findById(eq(1L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/Recommendation?id=1")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRepository, times(1)).findById(1L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Recommendation with id 1 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_recommendation() throws Exception {
                // arrange
                LocalDateTime DRdate1 = LocalDateTime.parse("2022-10-26T22:28:28.373");
                LocalDateTime DNdate1 = LocalDateTime.parse("2022-10-26T22:28:21.725");

                LocalDateTime DRdate2 = LocalDateTime.parse("2022-10-27T22:23:22.453");
                LocalDateTime DNdate2 = LocalDateTime.parse("2022-10-29T22:24:25.223");

                Recommendation recommendationOrig = Recommendation.builder()
                                .requesterEmail("requester1@gmail.com")
                                .professorEmail("professor1@gmail.com")
                                .explanation("recommendation is for xyz1 application")
                                .dateRequested(DRdate1)
                                .dateNeeded(DNdate1)
                                .done(false)
                                .build();

                Recommendation recommendationEdited = Recommendation.builder()
                                .requesterEmail("requester2@gmail.com")
                                .professorEmail("professor2@gmail.com")
                                .explanation("recommendation is for xyz2 application")
                                .dateRequested(DRdate2)
                                .dateNeeded(DNdate2)
                                .done(false)
                                .build();

                String requestBody = mapper.writeValueAsString(recommendationEdited);

                when(recommendationRepository.findById(eq(1L))).thenReturn(Optional.of(recommendationOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/Recommendation?id=1")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRepository, times(1)).findById(1L);
                verify(recommendationRepository, times(1)).save(recommendationEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_recommendation_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime DRdate2 = LocalDateTime.parse("2023-10-27T22:23:22.453");
                LocalDateTime DNdate2 = LocalDateTime.parse("2023-10-29T22:24:25.223");

                Recommendation recommendationEditedDate = Recommendation.builder()
                                .requesterEmail("requester2@gmail.com")
                                .professorEmail("professor2@gmail.com")
                                .explanation("recommendation is for xyz2 application")
                                .dateRequested(DRdate2)
                                .dateNeeded(DNdate2)
                                .done(false)
                                .build();

                String requestBody = mapper.writeValueAsString(recommendationEditedDate);

                when(recommendationRepository.findById(eq(1L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/Recommendation?id=1")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRepository, times(1)).findById(1L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Recommendation with id 1 not found", json.get("message"));

        }
}