package com.applicare.applicare;

import com.applicare.applicare.model.User;
import com.applicare.applicare.model.JobApplication;
import com.applicare.applicare.model.Task;
import com.applicare.applicare.service.AuthService;
import com.applicare.applicare.service.JobApplicationService;
import com.applicare.applicare.service.TaskService;
import com.applicare.applicare.repository.UserRepository;
import com.applicare.applicare.repository.JobApplicationRepository;
import com.applicare.applicare.repository.TaskRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class ApplicareApplicationTests {

	@Autowired
	private AuthService authService;

	@Autowired
	private JobApplicationService jobApplicationService;

	@Autowired
	private TaskService taskService;

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private JobApplicationRepository jobApplicationRepository;

	@MockBean
	private TaskRepository taskRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private User testUser;
	private JobApplication testApplication;
	private Task testTask;

	@BeforeEach
	void setUp() {
		// Set up test user
		testUser = new User("testuser", "test@example.com", passwordEncoder.encode("password123"));
		testUser.setId("user123");

		// Set up test job application
		testApplication = new JobApplication();
		testApplication.setId("job123");
		testApplication.setUserId("user123");
		testApplication.setCompanyName("Test Company");
		testApplication.setJobTitle("Software Engineer");
		testApplication.setStatus("APPLIED");

		// Set up test task
		testTask = new Task();
		testTask.setId("task123");
		testTask.setUserId("user123");
		testTask.setTitle("Follow up email");
		testTask.setDeadline(LocalDate.now().plusDays(7));
		testTask.setPriority("HIGH");
	}

	// Test 1: User Registration
	@Test
	void testUserRegistration() {
		String username = "newuser";
		String email = "new@example.com";
		String password = "password123";

		when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
		when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
		when(userRepository.save(any(User.class))).thenReturn(new User(username, email, password));

		String result = authService.register(username, email, password);
		assertEquals("User registered successfully", result);
	}

	// Test 2: User Login
	@Test
	void testUserLogin() {
		String usernameOrEmail = "testuser";
		String password = "password123";

		when(userRepository.findByUsername(usernameOrEmail)).thenReturn(Optional.of(testUser));

		Map<String, String> result = authService.login(usernameOrEmail, password);
		
		assertNotNull(result.get("token"));
		assertEquals(testUser.getUsername(), result.get("username"));
		assertEquals(testUser.getEmail(), result.get("email"));
	}

	// Test 3: Create Job Application
	@Test
	void testCreateJobApplication() {
		when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(testApplication);

		JobApplication result = jobApplicationService.createApplication(testApplication, "user123");

		assertNotNull(result);
		assertEquals("Test Company", result.getCompanyName());
		assertEquals("Software Engineer", result.getJobTitle());
		assertEquals("APPLIED", result.getStatus());
	}

	// Test 4: Create and Complete Task
	@Test
	void testCreateAndCompleteTask() {
		when(taskRepository.save(any(Task.class))).thenReturn(testTask);
		when(taskRepository.findById("task123")).thenReturn(Optional.of(testTask));

		// Create task
		Task createdTask = taskService.createTask(testTask, "user123");
		assertNotNull(createdTask);
		assertEquals("Follow up email", createdTask.getTitle());
		assertFalse(createdTask.isCompleted());

		// Complete task
		taskService.toggleTaskCompletion("task123", "user123");
		assertTrue(testTask.isCompleted());
	}

	// Test 5: Get User's Job Applications by Status
	@Test
	void testGetApplicationsByStatus() {
		List<JobApplication> applications = Arrays.asList(testApplication);
		when(jobApplicationRepository.findByUserIdAndStatus("user123", "APPLIED"))
			.thenReturn(applications);

		List<JobApplication> result = jobApplicationService.getApplicationsByStatus("user123", "APPLIED");

		assertNotNull(result);
		assertFalse(result.isEmpty());
		assertEquals(1, result.size());
		assertEquals("Test Company", result.get(0).getCompanyName());
		assertEquals("APPLIED", result.get(0).getStatus());
	}
}
