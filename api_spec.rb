require_relative "spec_helper"

def check_dir_listing_content_type(content_type)
  content_type.must_match(%r{application\/(ld\+)?json})
  if content_type != "application/ld+json"
    puts "WARNING: the content type \"#{content_type}\" works for directory listings, but the correct one to use is \"application/ld+json\"".yellow
  end
end

describe "public" do

  describe "PUT with a read/write category token" do
    it "works" do
      res = do_put_request("public/#{CONFIG[:category]}/test-object-simple.json",
                           '{"new": "object"}',
                           { content_type: "application/json" })

      [200, 201].must_include res.code
    end
  end

  describe "PUT with a read/write category token to wrong category" do
    it "fails" do
      res = do_put_request("public/othercategory/test-object-simple.json",
                           '{"new": "object"}',
                           { content_type: "application/json" })

      [401, 403].must_include res.code
    end
  end

  describe "GET without a token" do
    it "works" do
      res = do_get_request("public/#{CONFIG[:category]}/test-object-simple.json",
                           authorization: nil)

      res.code.must_equal 200
    end
  end

  describe "HEAD without a token" do
    it "works" do
      res = do_head_request("public/#{CONFIG[:category]}/test-object-simple.json",
                            authorization: nil)

      [200, 204].must_include res.code
      res.body.must_be_empty
    end
  end

  describe "PUT without a token" do
    it "is not allowed" do
      res = do_put_request("public/#{CONFIG[:category]}/test-object-simple-test.json",
                           '{"new": "object"}',
                           { content_type: "application/json",
                             authorization: nil })

      [401, 403].must_include res.code
    end
  end

  describe "GET directory listing without a token" do
    it "is not allowed" do
      res = do_get_request("public/#{CONFIG[:category]}/", authorization: nil)

      [401, 403].must_include res.code
    end

    it "doesn't expose if folder is empty" do
      res = do_get_request("public/#{CONFIG[:category]}/", authorization: nil)
      res2 = do_get_request("public/#{CONFIG[:category]}/foo/", authorization: nil)

      res.code.must_equal res2.code
      res.headers.must_equal res2.headers
      res.body.must_equal res2.body
    end
  end

  describe "GET directory listing with a read-write category token" do
    it "works" do
      res = do_get_request("public/#{CONFIG[:category]}/")

      res.code.must_equal 200
    end
  end

  describe "DELETE without a token" do
    it "is not allowed" do
      res = do_delete_request("public/#{CONFIG[:category]}/test-object-simple.json",
                              authorization: nil)

      [401, 403].must_include res.code
    end
  end

  describe "DELETE with a read/write category token" do
    it "works" do
      res = do_delete_request("public/#{CONFIG[:category]}/test-object-simple.json")

      [200, 204].must_include res.code
    end
  end

end
