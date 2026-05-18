package project.voting.service;

import project.voting.entity.Candidate;
import project.voting.entity.Voter;
import project.voting.repository.CandidateRepository;
import project.voting.repository.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoterRepository voterRepository;

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Candidate voteForCandidate(Integer candidateId, Voter voter) {
        // Cek double vote dari database (bukan hanya dari token)
        Voter freshVoter = voterRepository.findById(voter.getId())
            .orElseThrow(() -> new IllegalArgumentException("Voter tidak ditemukan."));

        if (freshVoter.getHasVoted()) {
            throw new IllegalArgumentException("Anda sudah memberikan suara sebelumnya.");
        }

        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new IllegalArgumentException("Kandidat tidak ditemukan."));

        // Tambah vote count
        candidate.setVoteCount(candidate.getVoteCount() + 1);
        candidateRepository.save(candidate);

        // ✅ Tandai voter sudah vote
        freshVoter.setHasVoted(true);
        voterRepository.save(freshVoter);

        return candidate;
    }
}