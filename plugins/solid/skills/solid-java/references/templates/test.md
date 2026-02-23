---
name: test-template
description: JUnit 5 and Mockito unit tests
when-to-use: writing unit tests, test setup
keywords: test, JUnit 5, Mockito, unit test
---

# Test Template

JUnit 5 + Mockito tests.

## Service Unit Test

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock ProductRepository mockRepository;
    @Mock ProductValidator mockValidator;
    ProductService service;

    @BeforeEach void setUp() {
        service = new ProductService(mockRepository, mockValidator);
    }

    @Test @DisplayName("findById returns product DTO")
    void testFindById_Success() {
        Long id = 1L;
        Product mockEntity = new Product("Widget", BigDecimal.TEN);
        mockEntity.setId(id);
        when(mockRepository.findById(id)).thenReturn(Optional.of(mockEntity));

        ProductDTO result = service.findById(id);

        assertNotNull(result);
        assertEquals(id, result.id());
        verify(mockRepository).findById(id);
    }

    @Test void testFindById_NotFound() {
        when(mockRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ProductNotFoundException.class, () -> service.findById(999L));
    }

    @Test void testCreate_Success() {
        CreateProductDTO dto = new CreateProductDTO("Widget", BigDecimal.TEN);
        Product saved = new Product("Widget", BigDecimal.TEN);
        saved.setId(2L);
        when(mockRepository.save(any())).thenReturn(saved);

        ProductDTO result = service.create(dto);

        assertNotNull(result);
        assertEquals(2L, result.id());
        verify(mockValidator).validate(dto);
        verify(mockRepository).save(any());
    }

    @Test void testDelete_Success() {
        when(mockRepository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(mockRepository).deleteById(1L);
    }
}
```

## Controller Test

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean ProductService mockService;

    @Test void testGetById_Success() throws Exception {
        ProductDTO dto = new ProductDTO(1L, "Widget", BigDecimal.TEN);
        when(mockService.findById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/products/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.name", is("Widget")));
    }

    @Test void testCreate_Success() throws Exception {
        CreateProductDTO request = new CreateProductDTO("New", BigDecimal.TEN);
        ProductDTO response = new ProductDTO(2L, "New", BigDecimal.TEN);
        when(mockService.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(2)));
    }
}
```

## Repository Test

```java
@DataJpaTest
class ProductRepositoryTest {
    @Autowired ProductRepository repository;

    @Test void testSave_And_FindById() {
        Product product = new Product("Widget", BigDecimal.TEN);
        Product saved = repository.save(product);

        assertNotNull(saved.getId());
        assertTrue(repository.findById(saved.getId()).isPresent());
    }

    @Test void testFindByName() {
        repository.save(new Product("Unique", BigDecimal.TEN));
        assertTrue(repository.findByName("Unique").isPresent());
        assertFalse(repository.findByName("Missing").isPresent());
    }
}
```

## Parameterized Tests

```java
class PriceCalculationServiceTest {
    PriceCalculationService service = new PriceCalculationService();

    @ParameterizedTest
    @CsvSource({"1,0", "10,5", "50,10", "100,15"})
    void testQuantityDiscount(int qty, int expected) {
        assertEquals(BigDecimal.valueOf(expected),
            service.getQuantityDiscount(qty));
    }

    @ParameterizedTest
    @ValueSource(strings = {"0", "-10", "-0.01"})
    void testValidatePrice_Negative(String price) {
        assertThrows(IllegalArgumentException.class,
            () -> service.validatePrice(new BigDecimal(price)));
    }
}
```

## Checklist

- [ ] JUnit 5 with `@Test` and `@DisplayName`
- [ ] Mocks via `@Mock` with `@ExtendWith(MockitoExtension.class)`
- [ ] AAA structure: Arrange, When, Then
- [ ] Controllers tested with `@WebMvcTest`
- [ ] Repositories tested with `@DataJpaTest`
- [ ] Parameterized tests for multiple cases
