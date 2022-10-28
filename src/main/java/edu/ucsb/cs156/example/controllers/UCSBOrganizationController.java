package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Api(description = "UCSBOrganizations")
@RequestMapping("/api/ucsborganization")
@RestController
@Slf4j
public class UCSBOrganization extends ApiController {

    @Autowired
    UCSBOrganization ucsbOrganization;

    @ApiOperation(value = "List all ucsb organizations")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBOrganization> allUCSBOrganizations() {
        Iterable<UCSBOrganization> org = ucsbOrganizationRepository.findAll();
        return org;
    }

    @ApiOperation(value = "Get a single organization")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBOrganization getById(
            @ApiParam("id") @RequestParam Long id) {
        UCSBOrganization ucsbOrganization = ucsbOrganizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, id));

        return ucsbOrganization;
    }

    @ApiOperation(value = "Create a new organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBOrganization postUCSBOrganization(
            @ApiParam("orgCode (organization abbreviation)") @RequestParam String orgCode,
            @ApiParam("orgTranslationShort (organization name for short)") @RequestParam String orgTranslationShort,
            @ApiParam("orgTranslation (full name of organization)") @RequestParam String orgTranslation,
            @ApiParam("inactive (full name of organization, true or false)") @RequestParam boolean inactive)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("localDateTime={}", localDateTime);

        UCSBDate ucsbDate = new UCSBDate();
        ucsbDate.setQuarterYYYYQ(quarterYYYYQ);
        ucsbDate.setName(name);
        ucsbDate.setLocalDateTime(localDateTime);

        UCSBDate savedUcsbDate = ucsbDateRepository.save(ucsbDate);

        return savedUcsbDate;
    }

    @ApiOperation(value = "Delete a UCSBDate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBDate(
            @ApiParam("id") @RequestParam Long id) {
        UCSBDate ucsbDate = ucsbDateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDate.class, id));

        ucsbDateRepository.delete(ucsbDate);
        return genericMessage("UCSBDate with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single date")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDate updateUCSBDate(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid UCSBDate incoming) {

        UCSBDate ucsbDate = ucsbDateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDate.class, id));

        ucsbDate.setQuarterYYYYQ(incoming.getQuarterYYYYQ());
        ucsbDate.setName(incoming.getName());
        ucsbDate.setLocalDateTime(incoming.getLocalDateTime());

        ucsbDateRepository.save(ucsbDate);

        return ucsbDate;
    }
}
