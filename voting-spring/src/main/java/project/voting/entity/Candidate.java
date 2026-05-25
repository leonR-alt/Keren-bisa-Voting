package project.voting.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String party;
    private int voteCount = 0;

    @Column(columnDefinition = "TEXT")
    private String visi;

    @Column(columnDefinition = "TEXT")
    private String misi;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getParty() { return party; }
    public void setParty(String party) { this.party = party; }

    public int getVoteCount() { return voteCount; }
    public void setVoteCount(int voteCount) { this.voteCount = voteCount; }

    public String getVisi() { return visi; }
    public void setVisi(String visi) { this.visi = visi; }

    public String getMisi() { return misi; }
    public void setMisi(String misi) { this.misi = misi; }
}