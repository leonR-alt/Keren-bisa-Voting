package project.voting.controller;

import project.voting.entity.Candidate;
import project.voting.entity.Voter;
import project.voting.service.CandidateService;
import project.voting.security.JwtTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private JwtTokenService jwtTokenService;

    // Get all candidates
    @GetMapping
    public ResponseEntity<List<Candidate>> getAllCandidates(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenService.validateToken(token)) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }

        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    // Vote for a candidate
    @PostMapping("/{id}/vote")
public ResponseEntity<?> voteForCandidate(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable Integer id) {
    String token = authHeader.replace("Bearer ", "");
    if (!jwtTokenService.validateToken(token)) {
        return ResponseEntity.status(401).body("Invalid or expired token.");
    }

    Voter voter = jwtTokenService.getVoterFromToken(token);
    if (voter == null) {
        return ResponseEntity.status(403).body("Unable to extract voter details.");
    }

    // ✅ Cek apakah sudah pernah vote
    if (voter.getHasVoted()) {
        return ResponseEntity.status(400).body("Anda sudah memberikan suara sebelumnya.");
    }

    try {
        Candidate updatedCandidate = candidateService.voteForCandidate(id, voter);
        return ResponseEntity.ok(updatedCandidate);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("An error occurred while voting.");
    }
}
}
